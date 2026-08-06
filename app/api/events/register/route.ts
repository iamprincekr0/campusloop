import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EVENT_SLUG = "extension-board-2026";

type Body = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  institution?: unknown;
  course?: unknown;
  branch?: unknown;
  yearOfStudy?: unknown;
  rollNumber?: unknown;
  consent?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function text(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, max)
    : "";
}

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function friendlyError(message: string) {
  if (message.includes("DUPLICATE_EMAIL"))
    return [409, "Is email se registration pehle hi ho chuka hai."] as const;
  if (message.includes("DUPLICATE_PHONE"))
    return [409, "Is mobile number se registration pehle hi ho chuka hai."] as const;
  if (message.includes("REGISTRATION_CLOSED"))
    return [409, "Event registration closed hai."] as const;
  if (message.includes("EVENT_FULL"))
    return [409, "Event capacity full ho chuki hai."] as const;
  if (message.includes("RATE_LIMITED"))
    return [429, "Bahut attempts hue hain. 15 minute baad try karo."] as const;
  if (message.includes("INVALID_"))
    return [400, "Form details check karke dobara submit karo."] as const;
  return [500, "Registration save nahi ho paya. Dobara try karo."] as const;
}

export async function POST(request: NextRequest) {
  let body: Body;

  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const honeypot = text(body.website, 200);
  const startedAt =
    typeof body.startedAt === "number" ? body.startedAt : Number(body.startedAt);

  if (honeypot) return json({ ok: true }, 200);

  if (
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < 2500 ||
    Date.now() - startedAt > 60 * 60 * 1000
  ) {
    return json(
      { ok: false, message: "Page refresh karke form dobara bharo." },
      400
    );
  }

  const fullName = text(body.fullName, 100);
  const email = text(body.email, 160).toLowerCase();
  const phone = text(body.phone, 20);
  const institution = text(body.institution, 160);
  const course = text(body.course, 100);
  const branch = text(body.branch, 100);
  const yearOfStudy = text(body.yearOfStudy, 30);
  const rollNumber = text(body.rollNumber, 40);
  const consent = body.consent === true;

  if (
    !fullName ||
    !email ||
    !phone ||
    !institution ||
    !course ||
    !branch ||
    !yearOfStudy ||
    !consent
  ) {
    return json(
      { ok: false, message: "Sabhi required fields complete karo." },
      400
    );
  }

  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    console.error("Supabase server secret missing");
    return json({ ok: false, message: "Server configuration incomplete hai." }, 500);
  }

  const fingerprint = createHmac("sha256", secret)
    .update(`${EVENT_SLUG}|${clientIp(request)}|${email}`)
    .digest("hex");

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

  const { count: recentAttempts, error: attemptReadError } = await supabaseAdmin
    .from("registration_attempts")
    .select("id", { count: "exact", head: true })
    .eq("event_slug", EVENT_SLUG)
    .eq("fingerprint", fingerprint)
    .gte("attempted_at", fifteenMinutesAgo);

  if (attemptReadError) {
    console.error("Rate-limit read error:", attemptReadError.message);
    return json({ ok: false, message: "Registration service unavailable hai." }, 503);
  }

  if ((recentAttempts || 0) >= 5) {
    return json(
      { ok: false, message: "Bahut attempts hue hain. 15 minute baad try karo." },
      429
    );
  }

  const { error: attemptInsertError } = await supabaseAdmin
    .from("registration_attempts")
    .insert({ event_slug: EVENT_SLUG, fingerprint });

  if (attemptInsertError) {
    console.error("Rate-limit insert error:", attemptInsertError.message);
    return json({ ok: false, message: "Registration service unavailable hai." }, 503);
  }

  const { data, error } = await supabaseAdmin.rpc("register_event_submission", {
    p_event_slug: EVENT_SLUG,
    p_full_name: fullName,
    p_email: email,
    p_phone: phone,
    p_institution: institution,
    p_course: course,
    p_branch: branch,
    p_year_of_study: yearOfStudy,
    p_roll_number: rollNumber || null,
    p_consent: consent,
    p_fingerprint: fingerprint,
  });

  if (error) {
    console.error("Registration error:", error.message);
    const [status, message] = friendlyError(error.message);
    return json({ ok: false, message }, status);
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.registration_code) {
    return json({ ok: false, message: "Invalid registration response." }, 500);
  }

  return json(
    {
      ok: true,
      registrationCode: result.registration_code,
      eventTitle: result.event_title,
      eventDate: result.event_date,
      venue: result.venue,
    },
    201
  );
}
