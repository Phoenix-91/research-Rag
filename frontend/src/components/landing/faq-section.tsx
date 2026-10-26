"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What types of files can I upload?",
    a: "Currently PaperMind AI supports PDF files up to 50MB. We extract text page-by-page using PyMuPDF. Scanned-image PDFs without embedded text may produce poor results — we recommend using PDFs with selectable text.",
  },
  {
    q: "Do I need a GPU to run this locally?",
    a: "The embedding model (all-MiniLM-L6-v2) runs on CPU and is fast enough for most papers. If you use Ollama for chat inference, a GPU with 8GB+ VRAM is recommended for 7B-parameter models. Groq cloud inference requires no local GPU.",
  },
  {
    q: "How does the RAG pipeline work?",
    a: "When you upload a paper, we split the text into chunks and convert them to vector embeddings. When you ask a question, we find the most relevant chunks using vector similarity search, then send those chunks plus your question to the LLM. The answer always references specific pages.",
  },
  {
    q: "Is my research data private?",
    a: "If you use Ollama, everything stays on your machine. If you use Groq, your query and the retrieved paper chunks are sent to Groq's API for inference. API keys are never exposed to the browser. You can delete all paper data at any time.",
  },
  {
    q: "Can I use this with models other than Groq and Ollama?",
    a: "The backend uses a provider abstraction layer. Adding OpenAI-compatible endpoints, Gemini, or other providers requires implementing a single adapter class. The architecture is designed for extensibility.",
  },
  {
    q: "What is the knowledge graph feature?",
    a: "The knowledge graph extracts concepts, methods, findings, and relationships from your papers and visualizes them as an interactive network. It helps you see how ideas connect within and across papers. This feature uses Neo4j and is available after basic RAG is functional.",
  },
];

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "20px 0",
          background: "none",
          border: "none",
          color: "var(--text-primary)",
          fontSize: 15,
          fontWeight: 500,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
          lineHeight: 1.5,
        }}
      >
        {faq.q}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} color="var(--text-muted)" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.7,
                paddingBottom: 20,
                maxWidth: 640,
              }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section" id="docs">
      <div className="section-container" style={{ maxWidth: 720 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span className="badge badge-emerald" style={{ marginBottom: 16 }}>
            FAQ
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginTop: 12,
            }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <FaqItem faq={faq} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
