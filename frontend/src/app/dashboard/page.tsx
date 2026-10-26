"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  MessageSquare,
  Network,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface HealthStatus {
  status: string;
  service: string;
  version: string;
}

export default function DashboardPage() {
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/health");
        if (res.ok) {
          const data = await res.json();
          setBackendHealth(data);
          setHealthError(null);
        } else {
          setHealthError("Backend returned an error");
        }
      } catch {
        setHealthError("Cannot connect to backend");
      }
    };
    checkHealth();
  }, []);

  const stats = [
    { icon: FileText, label: "Papers Uploaded", value: "0", href: "/dashboard/papers" },
    { icon: MessageSquare, label: "Conversations", value: "0", href: "/dashboard/chat" },
    { icon: Network, label: "Graph Nodes", value: "0", href: "/dashboard/knowledge-graph" },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}
          >
            Welcome to PaperMind AI
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Your research intelligence workspace. Upload papers and start exploring.
          </p>
        </div>

        {/* Backend status */}
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Activity size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Backend Status:
          </span>
          {backendHealth ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--accent-primary)",
              }}
            >
              <CheckCircle2 size={14} />
              {backendHealth.service} v{backendHealth.version} — {backendHealth.status}
            </span>
          ) : healthError ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--error)",
              }}
            >
              <AlertCircle size={14} />
              {healthError}
            </span>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Checking...</span>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="card card-interactive"
              style={{
                padding: 20,
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
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
                <stat.icon size={18} color="var(--accent-primary)" />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <h2
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <Link
            href="/dashboard/papers?upload=true"
            className="card card-interactive"
            style={{
              padding: 24,
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "var(--accent-primary-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Upload size={22} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                Upload a Paper
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Upload a PDF and start asking questions
              </div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>

          <Link
            href="/dashboard/chat"
            className="card card-interactive"
            style={{
              padding: 24,
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "var(--accent-primary-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MessageSquare size={22} color="var(--accent-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                Start a Chat
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Ask questions about your uploaded papers
              </div>
            </div>
            <ArrowRight size={16} color="var(--text-muted)" />
          </Link>
        </div>

        {/* Recent papers placeholder */}
        <h2
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            marginTop: 32,
            marginBottom: 16,
          }}
        >
          Recent Papers
        </h2>
        <div
          className="card"
          style={{
            padding: 48,
            textAlign: "center",
          }}
        >
          <Clock size={32} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            No papers uploaded yet. Upload your first research paper to get started.
          </p>
          <Link
            href="/dashboard/papers?upload=true"
            className="btn btn-primary"
            style={{
              textDecoration: "none",
              marginTop: 16,
              display: "inline-flex",
              fontSize: 13,
              padding: "9px 20px",
            }}
          >
            <Upload size={14} />
            Upload Paper
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
