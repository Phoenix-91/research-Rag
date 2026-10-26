"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Research Tools", href: "#research-tools" },
  { label: "Documentation", href: "#docs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled
          ? "rgba(9, 11, 10, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <nav className="section-container" style={{ padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-md)",
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={18} color="#090B0A" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: "-0.02em" }}>
              PaperMind
              <span style={{ color: "var(--accent-primary)" }}> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="btn-ghost"
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 8px" }} />
            <Link href="/dashboard" className="btn-ghost" style={{ fontSize: 14, textDecoration: "none" }}>
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ textDecoration: "none", fontSize: 13, padding: "8px 16px" }}
            >
              <Sparkles size={14} />
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="btn-ghost mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ display: "none" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mobile-menu"
            style={{
              background: "rgba(9, 11, 10, 0.95)",
              backdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "8px 24px 24px" }}>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "12px 0",
                    fontSize: 15,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <Link
                  href="/dashboard"
                  className="btn btn-secondary"
                  style={{ flex: 1, textDecoration: "none", textAlign: "center" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="btn btn-primary"
                  style={{ flex: 1, textDecoration: "none", textAlign: "center" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </motion.header>
  );
}
