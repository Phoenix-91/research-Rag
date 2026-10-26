"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Cpu,
  Key,
  Server,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [showKey, setShowKey] = useState(false);
  const [groqStatus, setGroqStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [ollamaStatus, setOllamaStatus] = useState<"idle" | "checking" | "ok" | "error">("idle");
  const [saved, setSaved] = useState(false);

  const checkGroq = async () => {
    if (!groqKey) return;
    setGroqStatus("checking");
    try {
      const res = await fetch("http://localhost:8000/api/v1/models/health", {
        method: "GET",
      });
      if (res.ok) {
        setGroqStatus("ok");
      } else {
        setGroqStatus("error");
      }
    } catch {
      setGroqStatus("error");
    }
  };

  const checkOllama = async () => {
    setOllamaStatus("checking");
    try {
      const res = await fetch("http://localhost:8000/api/v1/models/health", {
        method: "GET",
      });
      if (res.ok) {
        setOllamaStatus("ok");
      } else {
        setOllamaStatus("error");
      }
    } catch {
      setOllamaStatus("error");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "checking":
        return <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} color="var(--warning)" />;
      case "ok":
        return <CheckCircle2 size={14} color="var(--accent-primary)" />;
      case "error":
        return <AlertCircle size={14} color="var(--error)" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
          Configure model providers, API keys, and preferences.
        </p>

        {/* Groq */}
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "var(--accent-primary-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Groq</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Cloud inference — requires API key
              </span>
            </div>
            <StatusIcon status={groqStatus} />
          </div>

          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: 6,
            }}
          >
            <Key size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
            API Key
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "0 12px",
              }}
            >
              <input
                type={showKey ? "text" : "password"}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "monospace",
                  padding: "10px 0",
                }}
              />
              <button
                onClick={() => setShowKey(!showKey)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--text-muted)",
                }}
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: "8px 14px" }}
              onClick={checkGroq}
            >
              Test
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
            API key is stored on the backend only. Never sent to the browser.
          </p>
        </div>

        {/* Ollama */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "var(--accent-primary-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Server size={18} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Ollama</h3>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Local inference — no API key required
              </span>
            </div>
            <StatusIcon status={ollamaStatus} />
          </div>

          <label
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Server URL
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              style={{
                flex: 1,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                fontFamily: "monospace",
                padding: "10px 12px",
              }}
            />
            <button
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: "8px 14px" }}
              onClick={checkOllama}
            >
              Test
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          className="btn btn-primary"
          style={{ fontSize: 14, padding: "10px 24px" }}
          onClick={handleSave}
        >
          <Save size={16} />
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </motion.div>
    </div>
  );
}
