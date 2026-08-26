import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages, mode, userFullName, profile, projects, recommendations } = await req.json();

    const firstName = userFullName
      ? userFullName.trim().split(/\s+/)[0]
      : "Student";

    // Mode-specific specialized instructions
    let modeGuide = "";
    switch (mode) {
      case "Study":
        modeGuide = "Provide study strategies, topic explanations, exam preparation tips, or resources for technical courses.";
        break;
      case "Project":
        modeGuide = "Help build engineering prototypes, suggest tech stacks, outline step-by-step implementations, or help debug technical issues.";
        break;
      case "Career":
        modeGuide = "Give career guidance, placement prep, resume feedback, interview advice, or tell them what skills are in high demand.";
        break;
      case "Campus":
        modeGuide = "Share advice on navigating campus life, balancing extra-curriculars, and networking with peers and seniors.";
        break;
      case "Opportunity":
        modeGuide = "Identify current internships, hackathons, open-source projects, competitions, and technical programs students should apply for.";
        break;
      case "Campus Navigator":
      case "Navigator":
        modeGuide = "Help the student navigate their campus journey. Act as their personal campus operating system. Answer questions such as 'What should I do today?', 'What events are relevant to me?', 'What should I work on next?', 'Which opportunity matches my skills?', or 'How can I improve my profile?' Analyze their profile data and projects to suggest concrete next steps. Always mention matching actions and opportunities.";
        break;
      case "Next Step":
        modeGuide = "Outline 2-3 immediate, highly actionable steps the student should take right now to advance their learning or projects.";
        break;
      default:
        modeGuide = "Give general academic and project guidance.";
    }

    // Build the dynamic, context-aware student overview
    let studentContext = "";
    if (profile) {
      studentContext += `
Student Details:
- College: ${profile.college || "Not specified"}
- Course: ${profile.course || "Not specified"}
- Branch: ${profile.branch || "Not specified"}
- Current Year: ${profile.year || "Not specified"}
- Skills listed: ${
        Array.isArray(profile.skills) && profile.skills.length > 0
          ? profile.skills.join(", ")
          : "No skills listed yet"
      }
- Bio/About: ${profile.bio || "No biography filled yet"}
- Resume Status: ${profile.resume_url ? "Uploaded" : "NOT uploaded yet"}
`;
    }

    if (projects && Array.isArray(projects)) {
      if (projects.length > 0) {
        studentContext += `\nStudent Projects:\n`;
        projects.forEach((proj: any, idx: number) => {
          studentContext += `${idx + 1}. ${proj.title}: ${
            proj.description || "No description"
          } (Tech stack: ${
            Array.isArray(proj.tech_stack)
              ? proj.tech_stack.join(", ")
              : "Not listed"
          })\n`;
        });
      } else {
        studentContext += `\nStudent Projects: None listed yet.\n`;
      }
    }

    if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
      studentContext += `\nCurrently Recommended Actions & Opportunities:\n`;
      recommendations.forEach((rec: any) => {
        studentContext += `- [${rec.priority} Priority] ${rec.title}: ${rec.description} (Route: ${rec.actionHref})\n`;
      });
    }

    const systemPrompt = `You are CampusLoop AI, an intelligent student campus assistant and navigator.
Your goal is to provide practical, motivating, and actionable student guidance.
You are talking to ${firstName}. Make your responses personalized to them.
Focus your response on the current active mode: ${mode}. Specifically: ${modeGuide}

Here is the student's real profile, projects, and active intelligence recommendations context. Use it to tailor your response. If they ask about projects, what to do next, or matching opportunities, consult this context first. DO NOT invent details that are not provided. If a detail is missing, point it out as a logical next step (e.g. /profile, /projects/new, /opportunities).
${studentContext}

Format your answers with bullet points and bold text where appropriate for readability.
If you suggest visiting a specific workspace, you MUST mention the route name in your answer so the user knows where to click (e.g. "/profile" to upload a resume or photo, "/projects/new" to add a new project, "/opportunities" to view available matches, "/projects" to see their projects, or "/events/extension-board-2026" to register for events).
Respond in a friendly, concise, and professional Hinglish style (mostly English mixed with common, clean Hindi written in the English script).
Do not generate generic chatbot chatter. Give real, practical value.`;

    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
      return NextResponse.json(
        { error: "API credentials missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: formattedMessages }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Cloudflare Error:", data.errors);
      return NextResponse.json(
        { error: "Failed to fetch response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: data.result.response });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}