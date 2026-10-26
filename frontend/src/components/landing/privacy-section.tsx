"use client";

import { motion } from "framer-motion";
import { Lock, Server, Eye, EyeOff } from "lucide-react";

const privacyPoints = [
  {
    icon: Server,
    title: "Local-First Option",
    description:
      "Run Ollama on your machine for complete privacy. Papers, embeddings, and conversations stay on your hardware.",
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description:
      "API keys are stored only on the backend. They are never sent to the browser or logged in plaintext.",
  },
  {
    icon: EyeOff,
    title: "Your Data, Your Control",
    description:
      "Delete papers and all associated vectors, graph data, and conversations whenever you choose.",
  },
  {
    icon: Eye,
    title: "Transparent Processing",
    description:
      "You can see exactly which chunks are retrieved and sent to the LLM. No hidden context or undisclosed data sharing.",
  },
];

export function PrivacySection() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span className="badge badge-emerald" style={{ marginBottom: 16 }}>
            Privacy & Security
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
            Research Without{" "}
            <span className="text-gradient">Compromise</span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {privacyPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                padding: 24,
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <point.icon
                size={22}
                color="var(--accent-primary)"
                style={{ marginBottom: 14 }}
              />
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {point.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
