"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCampusRecommendations } from "../lib/campus-intelligence";

const MODES = [
  { id: "Study", icon: "📚", label: "Study Guide" },
  { id: "Project", icon: "🚀", label: "Project Help" },
  { id: "Campus Navigator", icon: "🧭", label: "Campus Navigator" },
  { id: "Career", icon: "💼", label: "Career Advice" },
  { id: "Campus", icon: "🏫", label: "Campus Life" },
  { id: "Opportunity", icon: "✨", label: "Opportunities" },
  { id: "Next Step", icon: "🎯", label: "Next Step" },
];

type ProfileData = {
  college: string | null;
  course: string | null;
  branch: string | null;
  year: string | null;
  skills: string[] | null;
  bio: string | null;
  resume_url: string | null;
} | null;

type ProjectData = {
  title: string;
  description: string | null;
  tech_stack: string[] | null;
};

type AIGuideProps = {
  userFullName: string;
  profile: ProfileData;
  projects: ProjectData[];
  upcomingEvents?: any[];
};

export default function AIGuide({
  userFullName,
  profile,
  projects,
  upcomingEvents = [],
}: AIGuideProps) {
  const firstName = userFullName.trim().split(/\s+/)[0] || "Student";
  const [activeMode, setActiveMode] = useState("Campus Navigator");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello ${firstName}! I am CampusLoop AI, your campus guide.

Select any of the modes above to focus our discussion. Choose 'Campus Navigator' for tailored suggestions based on your branch and skills.

How can I help you today?`,
      type: "text",
    },
  ]);

  // Compute student recommendations based on their current profile/project state
  const currentRecommendations = useMemo(() => {
    const p = profile
      ? {
          skills: profile.skills,
          bio: profile.bio,
          resume_url: profile.resume_url,
          avatar_url: null, // AI guide page is enough without avatar check details
          branch: profile.branch,
          year: profile.year,
          course: profile.course,
        }
      : null;

    const projs = projects.map((proj) => ({
      id: "proj-dummy",
      title: proj.title,
      description: proj.description,
      tech_stack: proj.tech_stack,
      github_url: null,
      live_url: null,
    }));

    const evts = upcomingEvents.map((evt) => ({
      id: evt.id || "evt-dummy",
      slug: evt.slug || "extension-board-2026",
      title: evt.title || "Upcoming Event",
      registration_open: evt.registration_open ?? true,
    }));

    return getCampusRecommendations(p, projs, evts);
  }, [profile, projects, upcomingEvents]);

  // Parse links from message content to generate quick actions
  const getActionButtons = (content: string) => {
    const buttons: { label: string; href: string }[] = [];
    if (content.includes("/profile")) {
      buttons.push({ label: "Complete Profile", href: "/profile" });
    }
    if (content.includes("/projects/new")) {
      buttons.push({ label: "Create Project", href: "/projects/new" });
    }
    if (content.includes("/opportunities")) {
      buttons.push({ label: "Explore Opportunities", href: "/opportunities" });
    }
    if (content.includes("/projects") && !content.includes("/projects/new")) {
      buttons.push({ label: "Open My Projects", href: "/projects" });
    }
    if (content.includes("/events")) {
      buttons.push({ label: "View Events", href: "/events/extension-board-2026" });
    }
    return buttons;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const isImageRequest = userText.toLowerCase().startsWith("/draw");

    // Add user message
    const userMessage = { role: "user", content: userText, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isImageRequest) {
        const imagePrompt = userText.replace("/draw", "").trim();

        const response = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: imagePrompt }),
        });

        const data = await response.json();

        if (data.imageUrl) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.imageUrl, type: "image" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Failed to generate image. Please try again.",
              type: "text",
            },
          ]);
        }
      } else {
        const textMessages = messages
          .filter((m) => m.type === "text")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...textMessages,
              { role: "user", content: userText },
            ],
            mode: activeMode,
            userFullName,
            profile,
            projects,
            recommendations: currentRecommendations,
          }),
        });

        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.reply, type: "text" },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I'm having trouble responding right now. Please try again.",
              type: "text",
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error! Please try again.",
          type: "text",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-slate-950/40 rounded-3xl border border-slate-900/60 shadow-2xl backdrop-blur-xl overflow-hidden relative">
      {/* Glowing Orb ambient indicator */}
      <div className="absolute top-[-50px] left-[50%] -translate-x-[50%] h-[120px] w-[220px] rounded-full bg-blue-500/5 blur-[50px] pointer-events-none" />

      {/* Mode Selector */}
      <div className="bg-slate-900/20 border-b border-slate-900/60 p-4 relative z-10">
        <div className="flex flex-wrap gap-2">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeMode === mode.id
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-slate-950/60 text-slate-400 border border-slate-900/60 hover:bg-white/5"
              }`}
            >
              <span>{mode.icon}</span> {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-950/10 scrollbar-thin relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const actions = msg.role === "assistant" && msg.type === "text" ? getActionButtons(msg.content) : [];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600/90 text-white rounded-br-none shadow-[0_4px_15px_rgba(59,130,246,0.25)]"
                      : "bg-slate-900/50 text-slate-200 border border-slate-800/40 rounded-bl-none shadow-inner"
                  }`}
                >
                  {msg.type === "image" ? (
                    <div className="relative w-full overflow-hidden rounded-xl mt-1 group">
                      <img
                        src={msg.content}
                        alt="Generated Visual"
                        className="w-full h-auto object-cover rounded-xl shadow-md border border-slate-800/50 transition duration-500 group-hover:scale-[1.01]"
                      />
                      <a
                        href={msg.content}
                        download="campusloop-ai-diagram.jpg"
                        className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-slate-950 transition backdrop-blur-sm shadow-md border border-slate-800/30 flex items-center gap-1.5"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {/* Render Quick Action buttons if parsed */}
                {actions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {actions.map((act) => (
                      <Link
                        key={act.href}
                        href={act.href}
                        className="inline-flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm hover:scale-[1.02]"
                      >
                        {act.label} <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 border border-slate-800/40 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-450 animate-pulse" />
                <span className="text-xs font-semibold text-slate-400 tracking-wide">
                  Generating...
                </span>
                <div className="flex gap-1 ml-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-900/60 relative z-10">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask in ${activeMode} mode or type /draw for diagrams & visuals...`}
            className="flex-1 bg-slate-900/40 border border-slate-900/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-950/30 transition duration-300"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-600/15 shrink-0 flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}