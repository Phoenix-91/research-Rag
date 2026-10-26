"use client";

import { motion } from "framer-motion";
import { Upload, Layers, Search, MessageSquare, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Paper",
    description:
      "Drop a PDF research paper. We extract text page by page, preserving structure and section boundaries.",
  },
  {
    icon: Layers,
    step: "02",
    title: "Chunk & Embed",
    description:
      "Text is split into meaningful chunks and converted to vector embeddings using a local model. Metadata is preserved.",
  },
  {
    icon: Search,
    step: "03",
    title: "Retrieve Context",
    description:
      "When you ask a question, we find the most relevant chunks from your paper using semantic vector search.",
  },
  {
    icon: MessageSquare,
    step: "04",
    title: "Generate Answers",
    description:
      "Retrieved passages are sent to your chosen LLM along with your question. Answers cite exact pages and sections.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span className="badge badge-emerald" style={{ marginBottom: 16 }}>
            How It Works
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
            Retrieval-Augmented
            <br />
            <span className="text-gradient">Generation Pipeline</span>
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
            Your questions are answered using the actual content of your papers
            — not general training data.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 24,
            position: "relative",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Step number */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent-primary)",
                  letterSpacing: "0.08em",
                  marginBottom: 16,
                }}
              >
                STEP {step.step}
              </span>

              {/* Icon circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <step.icon size={26} color="var(--accent-primary)" />
              </div>

              {/* Arrow connector (not on last) */}
              {i < steps.length - 1 && (
                <div
                  className="step-arrow"
                  style={{
                    position: "absolute",
                    right: -16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--border)",
                  }}
                >
                  <ArrowDown size={16} style={{ transform: "rotate(-90deg)" }} />
                </div>
              )}

              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: 8,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  maxWidth: 280,
                }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .step-arrow {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
