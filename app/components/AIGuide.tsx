"use client";

import { useState } from "react";

const MODES = [
  { id: "Study", icon: "📚", label: "Study Guide" },
  { id: "Project", icon: "🚀", label: "Project Help" },
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
};

export default function AIGuide({
  userFullName,
  profile,
  projects,
}: AIGuideProps) {
  const firstName = userFullName.trim().split(/\s+/)[0] || "Student";
  const [activeMode, setActiveMode] = useState("Study");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello ${firstName}! I am CampusLoop AI, your campus guide.

Select any of the modes above to focus our discussion. If you need engineering diagrams, study visuals, project visuals, or event creatives, type '/draw' followed by your prompt.

How can I help you today?`,
      type: "text",
    },
  ]);

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
    <div className="flex flex-col h-[70vh] bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Mode Selector */}
      <div className="bg-slate-50 border-b border-slate-200/80 p-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeMode === mode.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{mode.icon}</span> {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none shadow-sm shadow-blue-600/10"
                  : "bg-white text-slate-800 border border-slate-200/60 rounded-bl-none shadow-sm"
              }`}
            >
              {msg.type === "image" ? (
                <div className="relative w-full overflow-hidden rounded-xl mt-1">
                  <img
                    src={msg.content}
                    alt="Generated Visual"
                    className="w-full h-auto object-cover rounded-xl shadow-sm border border-slate-100"
                  />
                  <a
                    href={msg.content}
                    download="campusloop-ai-diagram.jpg"
                    className="absolute bottom-2.5 right-2.5 bg-slate-950/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-slate-950 transition backdrop-blur-sm shadow-sm"
                  >
                    Download
                  </a>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200/80">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask in ${activeMode} mode or type /draw for diagrams & visuals...`}
            className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-sm transition shadow-md shadow-blue-600/10 shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}