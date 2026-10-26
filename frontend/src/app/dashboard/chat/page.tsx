"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  FileText,
  Copy,
  RefreshCw,
  StopCircle,
  Cpu,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface Citation {
  page: number;
  text: string;
  chunk_id: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  model?: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "What is the main contribution of this paper?",
  "Summarize the methodology used.",
  "What are the key findings?",
  "What limitations does the paper discuss?",
  "Explain the experimental setup.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(
    async (text?: string) => {
      const message = text || input.trim();
      if (!message || streaming) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setStreaming(true);

      const assistantId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        citations: [],
        model: "Llama 3.3 70B",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        abortRef.current = new AbortController();
        const res = await fetch("http://localhost:8000/api/v1/papers/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            paper_id: selectedPaper,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error("Chat request failed");
        }

        // Handle streaming response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let fullContent = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullContent += parsed.content;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, content: fullContent }
                          : m
                      )
                    );
                  }
                  if (parsed.citations) {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantId
                          ? { ...m, citations: parsed.citations }
                          : m
                      )
                    );
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User cancelled
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      "Unable to connect to the backend. Please ensure the backend server is running on port 8000.",
                  }
                : m
            )
          );
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [input, streaming, selectedPaper]
  );

  const handleStop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRetry = (message: string) => {
    setMessages((prev) => prev.slice(0, -1));
    handleSend(message);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        maxWidth: 860,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Research Chat
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Ask questions about your uploaded papers
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--text-muted)",
            background: "var(--bg-secondary)",
            padding: "6px 12px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)",
          }}
        >
          <Cpu size={12} color="var(--accent-primary)" />
          Llama 3.3 70B · Groq
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "24px 24px 0",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "var(--radius-lg)",
                background: "var(--accent-primary-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={26} color="var(--accent-primary)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                Start a Research Conversation
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 400 }}>
                Upload a paper first, then ask questions about its content.
                Answers will include page citations.
              </p>
            </div>
            {/* Suggested prompts */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
                maxWidth: 600,
              }}
            >
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  style={{
                    fontSize: 13,
                    padding: "8px 14px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {/* Message bubble */}
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-lg)",
                      background:
                        msg.role === "user"
                          ? "var(--accent-primary-dim)"
                          : "var(--bg-elevated)",
                      border: `1px solid ${
                        msg.role === "user"
                          ? "rgba(52, 211, 153, 0.2)"
                          : "var(--border)"
                      }`,
                      fontSize: 14,
                      lineHeight: 1.7,
                      color:
                        msg.role === "user"
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content || (
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                        color="var(--accent-primary)"
                      />
                    )}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: 8, maxWidth: "85%" }}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        {msg.citations.map((cit, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              setExpandedCitation(
                                expandedCitation === `${msg.id}-${i}`
                                  ? null
                                  : `${msg.id}-${i}`
                              )
                            }
                            style={{
                              fontSize: 11,
                              padding: "4px 10px",
                              borderRadius: "var(--radius-full)",
                              background: "var(--accent-primary-dim)",
                              border: "1px solid rgba(52, 211, 153, 0.2)",
                              color: "var(--accent-primary)",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <FileText size={10} />
                            Page {cit.page}
                            <ChevronDown size={10} />
                          </button>
                        ))}
                      </div>
                      {/* Expanded citation */}
                      <AnimatePresence>
                        {msg.citations.map(
                          (cit, i) =>
                            expandedCitation === `${msg.id}-${i}` && (
                              <motion.div
                                key={`${msg.id}-${i}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{
                                  marginTop: 8,
                                  padding: "10px 14px",
                                  borderRadius: "var(--radius-md)",
                                  background: "var(--bg-secondary)",
                                  border: "1px solid var(--border)",
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                  lineHeight: 1.6,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "var(--accent-primary)",
                                    marginBottom: 4,
                                  }}
                                >
                                  Source — Page {cit.page}
                                </div>
                                {cit.text}
                              </motion.div>
                            )
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Actions for assistant messages */}
                  {msg.role === "assistant" && msg.content && (
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginTop: 6,
                      }}
                    >
                      <button
                        className="btn-ghost"
                        style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                        onClick={() => handleCopy(msg.content)}
                        title="Copy"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        className="btn-ghost"
                        style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: 11,
                          color: "var(--text-muted)",
                        }}
                        onClick={() => {
                          const userMsg = messages[messages.indexOf(msg) - 1];
                          if (userMsg) handleRetry(userMsg.content);
                        }}
                        title="Retry"
                      >
                        <RefreshCw size={12} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px 24px 24px",
          borderTop: "1px solid var(--border)",
        }}
      >
        {streaming && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <button
              onClick={handleStop}
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: "6px 14px" }}
            >
              <StopCircle size={14} />
              Stop generating
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "flex-end",
              padding: "4px 4px 4px 16px",
              transition: "border-color var(--transition-fast)",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your research paper..."
              rows={1}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "none",
                padding: "8px 0",
                lineHeight: 1.5,
                maxHeight: 120,
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="btn btn-primary"
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
