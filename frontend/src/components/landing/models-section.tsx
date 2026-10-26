"use client";

import { motion } from "framer-motion";
import { Cloud, HardDrive, Check } from "lucide-react";

const providers = [
  {
    name: "Groq",
    type: "Cloud Inference",
    icon: Cloud,
    description:
      "Ultra-fast inference on Llama, Mixtral, and Gemma models hosted on Groq's LPU hardware. Requires a free API key with usage limits.",
    models: ["Llama 3.3 70B", "Llama 3.1 8B", "Mixtral 8x7B", "Gemma 2 9B"],
    features: ["Sub-second latency", "Streaming responses", "Multiple model options"],
    note: "Free tier available with rate limits. See Groq documentation for current quotas.",
  },
  {
    name: "Ollama",
    type: "Local Inference",
    icon: HardDrive,
    description:
      "Run open-weight models entirely on your machine. No API key, no data leaves your computer. Requires local GPU for best performance.",
    models: ["Llama 3.1", "Mistral", "Phi-3", "Gemma 2"],
    features: ["Full privacy", "No API costs", "Offline capable"],
    note: "Performance depends on local hardware. 8GB+ VRAM recommended for 7B models.",
  },
];

export function ModelsSection() {
  return (
    <section id="research-tools" className="section">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span className="badge badge-emerald" style={{ marginBottom: 16 }}>
            Model Providers
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginTop: 12,
            }}
          >
            Choose Your{" "}
            <span className="text-gradient">AI Engine</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 17,
              marginTop: 16,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Switch between cloud and local models depending on your speed,
            privacy, and cost preferences.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 24,
          }}
        >
          {providers.map((provider, i) => (
            <motion.div
              key={provider.name}
              className="card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ padding: 32, display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    background: "var(--accent-primary-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <provider.icon size={22} color="var(--accent-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
                    {provider.name}
                  </h3>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {provider.type}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 20 }}>
                {provider.description}
              </p>

              {/* Models */}
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Available Models
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {provider.models.map((model) => (
                    <span
                      key={model}
                      style={{
                        fontSize: 12,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        background: "var(--bg-hover)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: 16 }}>
                {provider.features.map((feat) => (
                  <div
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    <Check size={14} color="var(--accent-primary)" />
                    {feat}
                  </div>
                ))}
              </div>

              {/* Note */}
              <p
                style={{
                  marginTop: "auto",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                  paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                }}
              >
                {provider.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
