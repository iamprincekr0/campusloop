"use client";
import { useState } from "react";

const MODES = [
  { id: "Study", icon: "📚", label: "Study Mode" },
  { id: "Project", icon: "🚀", label: "Project Help" },
  { id: "Career", icon: "💼", label: "Career Advice" },
  { id: "Campus", icon: "🏫", label: "Campus Life" },
];

export default function AIGuide() {
  const [activeMode, setActiveMode] = useState("Study");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "Hello! Main CampusLoop AI hoon. Text ke liye normal type karein, aur image/diagram banane ke liye '/draw' use karein. Example: '/draw a detailed power system diagram'",
      type: "text"
    }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const isImageRequest = userText.toLowerCase().startsWith("/draw");
    
    // User message add karo
    const userMessage = { role: "user", content: userText, type: "text" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (isImageRequest) {
        // --- IMAGE GENERATION LOGIC ---
        const imagePrompt = userText.replace("/draw", "").trim();
        
        const response = await fetch("/api/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: imagePrompt }),
        });
        
        const data = await response.json();
        
        if (data.imageUrl) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.imageUrl, type: "image" }]);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: "Image banane mein error aayi. Dobara try karein.", type: "text" }]);
        }
      } else {
        // --- TEXT GENERATION LOGIC ---
        const textMessages = messages
          .filter(m => m.type === "text") // Sirf text messages backend ko bhejein
          .map(m => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            messages: [...textMessages, { role: "user", content: userText }], 
            mode: activeMode 
          }),
        });

        const data = await response.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", content: data.reply, type: "text" }]);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error! Please try again.", type: "text" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Mode Selector */}
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeMode === mode.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>{mode.icon}</span> {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
              }`}>
              
              {msg.type === "image" ? (
                // Agar AI ne image bheji hai toh use render karo
                <div className="relative w-full overflow-hidden rounded-lg mt-2">
                  <img src={msg.content} alt="Generated AI Graphic" className="w-full h-auto object-cover rounded-lg shadow-sm border border-slate-100" />
                  <a href={msg.content} download="campusloop-ai-image.jpg" className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full hover:bg-black transition-colors backdrop-blur-sm">
                    Download
                  </a>
                </div>
              ) : (
                // Normal text message
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
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask in ${activeMode} mode or type /draw for images...`}
            className="flex-1 bg-slate-100 border-none rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}