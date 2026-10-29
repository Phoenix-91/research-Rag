"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  MessageSquareText,
  Network,
  Cpu,
  Shield,
  BookMarked,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Smart PDF Analysis",
    description:
      "Upload research papers and get page-by-page text extraction with intelligent chunking. Every answer traces back to the exact source.",
  },
  {
    icon: MessageSquareText,
    title: "RAG-Powered Chat",
    description:
      "Ask questions about uploaded papers and receive grounded answers with page citations. No hallucinated references.",
  },
  {
    icon: Network,
    title: "Knowledge Graphs",
    description:
      "Visualize concepts, methods, findings, and their relationships. Explore how ideas connect across different papers.",
  },
  {
    icon: Cpu,
    title: "Multi-Model Support",
    description:
      "Switch between Groq cloud inference and local Ollama models. Keep your research data private when needed.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Run models locally with Ollama. Your papers, questions, and insights never leave your machine if you choose.",
  },
  {
    icon: BookMarked,
    title: "Research Workspace",
    description:
      "Take notes, bookmark key findings, organize papers, and revisit past conversations. Your research stays organized.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function FeaturesSection() {
  return (
    <section id="features" className="section bg-grid">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span className="badge badge-emerald" style={{ marginBottom: 16 }}>
            Features
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
            Everything You Need to
            <br />
            <span className="text-gradient">Understand Research</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 17,
              marginTop: 16,
              maxWidth: 540,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.6,
            }}
          >
            From PDF upload to knowledge graph exploration — a complete toolkit
            for research intelligence.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="card card-interactive"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              style={{ padding: 28 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-primary-dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <feature.icon size={20} color="var(--accent-primary)" />
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
