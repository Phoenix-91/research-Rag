"use client";

import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function RecentPage() {
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Recent Papers
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
          Papers you have recently viewed or interacted with.
        </p>

        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <Clock size={32} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
            No recent activity. Upload and interact with papers to see them here.
          </p>
          <Link
            href="/dashboard/papers"
            className="btn btn-primary"
            style={{ textDecoration: "none", fontSize: 13, padding: "9px 20px", display: "inline-flex" }}
          >
            <FileText size={14} />
            Go to Papers
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
