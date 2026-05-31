import { useState, useRef, useEffect } from "react";

const suggestions = [
  { emoji: "🤒", label: "I have a fever" },
  { emoji: "🤧", label: "Sore throat for 3 days" },
  { emoji: "🤕", label: "I have headache" },
  { emoji: "🤢", label: "Stomach pain after eating" },
  { emoji: "😵‍💫", label: "Feeling tired and dizzy" },
];

const AIHealthAssistant = () => {
  const [symptoms, setSymptoms] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleAnalyze = async (text?: string) => {
    const userMessage = (text ?? symptoms).trim();
    if (!userMessage || loading) return;

    setSymptoms("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage, time: getTime() }]);
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          time: getTime(),
          text:
            `Based on your symptoms, here are some general insights:\n\n` +
            `• Monitor the duration and intensity of your symptoms.\n` +
            `• Stay hydrated and get adequate rest.\n` +
            `• If symptoms persist for more than 48 hours or worsen, consult a healthcare professional.`,
        },
      ]);
      setLoading(false);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const hasMessages = messages.length > 0 || loading;

  return (
    <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">ℹ️</span>
          <p className="text-xs text-muted-foreground leading-snug">
            <span className="font-medium text-foreground">Medical Disclaimer:</span>{" "}
            This is general information only and not a substitute for professional medical advice. Always consult a doctor for diagnosis or treatment.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">Online</span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* Empty / Welcome state */
          <div className="flex flex-col items-center justify-center h-full px-6 pb-4 gap-6 text-center">
            {/* Bot avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-3xl shadow-lg">
                🤖
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Hello! I'm your AI Health Assistant 👋
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  I can help you understand your symptoms and provide health insights.{" "}
                  <span className="text-teal-500 font-medium">
                   How can I assist you today?
                  </span>  
                </p>
              </div>
            </div>

            {/* Try asking chips — horizontal scroll */}
            <div className="w-full max-w-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground px-2">Try asking</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleAnalyze(s.label)}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border border-border bg-muted/50 hover:bg-muted hover:border-teal-500/50 transition-all text-center min-w-[90px]"
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-xs text-muted-foreground leading-tight">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-2xl mx-auto w-full px-4 py-5 space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-sm flex-shrink-0 mt-0.5 shadow-sm">
                    🤖
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[78%]">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-teal-500 text-white rounded-br-sm ml-auto"
                        : "bg-muted text-foreground rounded-bl-sm border border-border"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* Action cards for assistant */}
                  {msg.role === "assistant" && (
                    <div className="flex gap-2 mt-1">
                      {[
                        { icon: "🔍", label: "Possible Causes" },
                        { icon: "💊", label: "Recommended Actions" },
                        { icon: "🏥", label: "When to See a Doctor" },
                      ].map((card) => (
                        <button
                          key={card.label}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-muted hover:border-teal-500/40 text-muted-foreground hover:text-foreground transition-all"
                        >
                          <span>{card.icon}</span>
                          <span>{card.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <span className={`text-[10px] text-muted-foreground px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.time} {msg.role === "user" && "✓"}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                  🤖
                </div>
                <div className="bg-muted border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input — pinned at bottom */}
      <div className="flex-shrink-0 border-t border-border px-4 py-3 bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-2 bg-muted border border-border rounded-2xl px-4 py-2.5 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20 transition-all">
            <span className="text-muted-foreground mb-0.5 flex-shrink-0 text-base">🎤</span>
            <textarea
              ref={textareaRef}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms in detail…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-28 leading-relaxed"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !symptoms.trim()}
              className="w-8 h-8 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 mb-0.5 hover:scale-105 active:scale-95"
              aria-label="Send"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-1.5">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

    </div>
  );
};

export default AIHealthAssistant;
