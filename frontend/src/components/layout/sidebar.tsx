"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Clock,
  MessageSquare,
  Network,
  StickyNote,
  Settings,
  BookOpen,
  Upload,
  ChevronLeft,
  ChevronRight,
  Cpu,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "My Papers", href: "/dashboard/papers" },
  { icon: Clock, label: "Recent", href: "/dashboard/recent" },
  { icon: MessageSquare, label: "Research Chat", href: "/dashboard/chat" },
  { icon: Network, label: "Knowledge Graph", href: "/dashboard/knowledge-graph" },
  { icon: StickyNote, label: "Notes", href: "/dashboard/notes" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const pathname = usePathname();

  const width = collapsed ? 68 : 260;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "100dvh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "16px 12px" : "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 56,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text-primary)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BookOpen size={16} color="#090B0A" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap" }}
            >
              PaperMind<span style={{ color: "var(--accent-primary)" }}> AI</span>
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-ghost"
          style={{
            padding: 6,
            borderRadius: "var(--radius-sm)",
            color: "var(--text-muted)",
            flexShrink: 0,
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Upload button */}
      <div style={{ padding: collapsed ? "12px 10px" : "12px 16px" }}>
        <Link
          href="/dashboard/papers?upload=true"
          className={collapsed ? "btn btn-primary" : "btn btn-primary"}
          style={{
            width: "100%",
            textDecoration: "none",
            fontSize: 13,
            padding: collapsed ? "10px 0" : "10px 16px",
            justifyContent: "center",
          }}
        >
          <Upload size={16} />
          {!collapsed && "Upload Paper"}
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: collapsed ? "4px 10px" : "4px 12px", overflow: "auto" }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 12px" : "9px 14px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--accent-primary)" : "var(--text-muted)",
                background: active ? "var(--accent-primary-dim)" : "transparent",
                marginBottom: 2,
                transition: "all var(--transition-fast)",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Model selector */}
      <div
        style={{
          padding: collapsed ? "12px 10px" : "12px 16px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => setModelMenuOpen(!modelMenuOpen)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "8px 0" : "8px 12px",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "inherit",
            justifyContent: collapsed ? "center" : "flex-start",
            transition: "border-color var(--transition-fast)",
          }}
        >
          <Cpu size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Llama 3.3 · Groq
            </span>
          )}
        </button>
      </div>

      {/* User profile */}
      <div
        style={{
          padding: collapsed ? "12px 10px" : "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-full)",
            background: "var(--accent-primary-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <User size={16} color="var(--accent-primary)" />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
              Researcher
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Local Session</div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
