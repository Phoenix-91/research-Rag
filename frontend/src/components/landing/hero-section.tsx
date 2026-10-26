"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  FileText,
  MessageSquare,
  Network,
  Cpu,
} from "lucide-react";
import Link from "next/link";

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function ProductPreview() {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        marginTop: 56,
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        overflow: "hidden",
        boxShadow: "0 0 80px rgba(52, 211, 153, 0.06), 0 32px 64px rgba(0,0,0,0.4)",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399" }} />
        <span
          style={{
            marginLeft: 12,
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "monospace",
          }}
        >
          papermind.ai — Research Workspace
        </span>
      </div>

      {/* Preview panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          minHeight: 340,
        }}
        className="preview-grid"
      >
        {/* PDF Panel */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <FileText size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              PDF Reader
            </span>
          </div>
          {/* Mock document lines */}
          {[100, 85, 92, 78, 95, 60, 88, 72, 96, 83, 70, 90].map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
              style={{
                height: 6,
                width: `${w}%`,
                borderRadius: 3,
                background:
                  i === 3 || i === 4
                    ? "var(--accent-primary-dim)"
                    : "var(--bg-hover)",
              }}
            />
          ))}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              gap: 6,
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Page 4 of 12</span>
          </div>
        </div>

        {/* Chat Panel */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <MessageSquare size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              AI Chat
            </span>
          </div>
          {/* User message */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            style={{
              alignSelf: "flex-end",
              background: "var(--accent-primary-dim)",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              fontSize: 12,
              color: "var(--text-primary)",
              maxWidth: "85%",
            }}
          >
            What methodology does this paper use?
          </motion.div>
          {/* AI response */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "10px 12px",
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            The paper uses a{" "}
            <span style={{ color: "var(--accent-primary)", fontWeight: 500 }}>
              transformer-based architecture
            </span>{" "}
            with multi-head attention for cross-document retrieval...
            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <FileText size={10} /> Source: Page 4, Section 3.2
            </div>
          </motion.div>
          {/* Input */}
          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
                fontSize: 12,
                color: "var(--text-muted)",
              }}
            >
              Ask about this paper...
            </div>
          </div>
        </div>

        {/* Knowledge Graph Panel */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Network size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
              Knowledge Graph
            </span>
          </div>
          {/* Mock graph nodes */}
          <svg viewBox="0 0 200 200" style={{ width: "100%", flex: 1 }}>
            {/* Edges */}
            <motion.line
              x1="100" y1="50" x2="50" y2="110"
              stroke="var(--border)" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            />
            <motion.line
              x1="100" y1="50" x2="150" y2="100"
              stroke="var(--border)" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            />
            <motion.line
              x1="50" y1="110" x2="90" y2="160"
              stroke="var(--border)" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            />
            <motion.line
              x1="150" y1="100" x2="130" y2="155"
              stroke="var(--border)" strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.9, duration: 0.5 }}
            />
            {/* Nodes */}
            {[
              { cx: 100, cy: 50, label: "Transformers", delay: 1.2, primary: true },
              { cx: 50, cy: 110, label: "Attention", delay: 1.4, primary: false },
              { cx: 150, cy: 100, label: "RAG", delay: 1.5, primary: false },
              { cx: 90, cy: 160, label: "Retrieval", delay: 1.7, primary: false },
              { cx: 130, cy: 155, label: "Vectors", delay: 1.8, primary: false },
            ].map((node) => (
              <motion.g
                key={node.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: node.delay, duration: 0.4, type: "spring" }}
              >
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={node.primary ? 18 : 14}
                  fill={
                    node.primary
                      ? "var(--accent-primary-dim)"
                      : "var(--bg-elevated)"
                  }
                  stroke={
                    node.primary ? "var(--accent-primary)" : "var(--border)"
                  }
                  strokeWidth="1"
                />
                <text
                  x={node.cx}
                  y={node.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    node.primary
                      ? "var(--accent-primary)"
                      : "var(--text-muted)"
                  }
                  fontSize="7"
                  fontWeight={node.primary ? "600" : "400"}
                  fontFamily="Geist, system-ui, sans-serif"
                >
                  {node.label}
                </text>
              </motion.g>
            ))}
          </svg>
        </div>
      </div>

      {/* Model selector bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cpu size={12} color="var(--accent-primary)" />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Model:</span>
          <span
            style={{
              fontSize: 11,
              color: "var(--accent-primary)",
              fontWeight: 500,
              background: "var(--accent-primary-dim)",
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
            }}
          >
            Llama 3.3 70B · Groq
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-primary)",
            }}
          />
          Connected
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .preview-grid {
            grid-template-columns: 1fr !important;
          }
          .preview-grid > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .preview-grid > div:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        paddingTop: 140,
        paddingBottom: 80,
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Orbital lines */}
      <svg
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1000,
          height: 600,
          opacity: 0.15,
          pointerEvents: "none",
        }}
        viewBox="0 0 1000 600"
      >
        <motion.ellipse
          cx="500" cy="300" rx="350" ry="180"
          fill="none" stroke="var(--accent-primary)" strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.ellipse
          cx="500" cy="300" rx="250" ry="120"
          fill="none" stroke="var(--accent-primary)" strokeWidth="0.5"
          strokeDasharray="4 8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ delay: 0.7, duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "500px 300px" }}
        />
      </svg>

      <motion.div
        className="section-container"
        style={{ textAlign: "center", position: "relative", padding: "0 24px" }}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span className="badge badge-emerald" style={{ fontSize: 13, padding: "5px 14px" }}>
            <Cpu size={13} />
            AI-Powered Research Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(36px, 5.5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            marginTop: 28,
            maxWidth: 860,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Turn Complex Research
          <br />
          Papers into{" "}
          <span className="text-gradient">Clear Insights</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            marginTop: 24,
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Upload research papers, ask better questions, uncover connections, and
          understand academic research with your personal AI research assistant.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: 36,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard"
            className="btn btn-primary"
            style={{
              textDecoration: "none",
              fontSize: 15,
              padding: "12px 28px",
              fontWeight: 600,
            }}
          >
            Start Exploring
            <ArrowRight size={16} />
          </Link>
          <a
            href="#how-it-works"
            className="btn btn-secondary"
            style={{
              textDecoration: "none",
              fontSize: 15,
              padding: "12px 28px",
            }}
          >
            <Play size={14} />
            Watch Demo
          </a>
        </motion.div>

        {/* Product Preview */}
        <ProductPreview />
      </motion.div>
    </section>
  );
}
