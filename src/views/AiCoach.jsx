import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const AiCoach = ({
  aiChat,
  chatInput,
  setChatInput,
  talkToCoach,
  isAiLoading,
}) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat]);

  return (
    <div className="flex flex-col h-full w-full">
      <header className="mb-8">
        <h2 className="text-4xl font-black text-teal-600 tracking-tight">
          Apastron AI Coach 
        </h2>
        <p className="text-slate-500 font-medium">
          Powered by Gemini AI
        </p>
      </header>

      <div className="flex-1 bg-slate-400 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-[3rem] overflow-y-auto space-y-6 mb-8">
        {aiChat.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%]  p-3 sm:p-6 md:p-6 rounded-2xl md:rounded-[2rem] text-sm ${
                m.role === "user"
                  ? "bg-slate-900 text-white rounded-tr-none"
                  : "bg-green-200 text-slate-800 rounded-tl-none"
              }`}
            >
              <div className="ai-response">
                  <ReactMarkdown>
                    {m.text}
                  </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isAiLoading && (
          <div className="text-xs text-blue-500 font-bold px-6 animate-pulse">
            Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-4">
        <textarea
  value={chatInput}
  onChange={(e) => setChatInput(e.target.value)}
  onInput={(e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }}
  placeholder="Ask about form, diet, or recovery..."
  rows={1}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      talkToCoach(chatInput);
    }
  }}
  className="flex-1 p-6 text-slate-900 placeholder-slate-400 bg-white border rounded-[2rem] resize-none overflow-hidden"
/>

        <button
          onClick={() => talkToCoach(chatInput)}
          className="p-6 bg-slate-900 text-white rounded-[2rem]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiCoach;
