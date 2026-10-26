"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section
      className="section"
      style={{
        background: "var(--bg-secondary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(52, 211, 153, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        className="section-container"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: "center",
          position: "relative",
          maxWidth: 640,
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
            margin: "0 auto 24px",
          }}
        >
          <Sparkles size={26} color="var(--accent-primary)" />
        </div>

        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Ready to Transform
          <br />
          Your Research?
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 17,
            marginTop: 16,
            lineHeight: 1.6,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Upload your first paper and start asking questions in minutes. No
          credit card required.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            marginTop: 32,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/dashboard"
            className="btn btn-primary"
            style={{
              textDecoration: "none",
              fontSize: 15,
              padding: "13px 32px",
              fontWeight: 600,
            }}
          >
            Start Exploring
            <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
