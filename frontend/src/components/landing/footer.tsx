"use client";

import { BookOpen, Github, ExternalLink } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Research Tools", href: "#research-tools" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Resources: [
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#docs" },
    { label: "FAQ", href: "#docs" },
    { label: "Changelog", href: "#" },
  ],
  "Open Source": [
    { label: "GitHub Repository", href: "https://github.com", external: true },
    { label: "Contributing", href: "#" },
    { label: "License (MIT)", href: "#" },
    { label: "Report Issue", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-main)",
      }}
    >
      <div
        className="section-container"
        style={{
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "1.5fr repeat(3, 1fr)",
          gap: 48,
        }}
      >
        {/* Brand column */}
        <div>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "var(--text-primary)",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-md)",
                background:
                  "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={15} color="#090B0A" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              PaperMind<span style={{ color: "var(--accent-primary)" }}> AI</span>
            </span>
          </Link>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: 260,
            }}
          >
            AI-powered research intelligence. Upload papers, ask questions, and
            discover connections.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{
                padding: 8,
                borderRadius: "var(--radius-md)",
                color: "var(--text-muted)",
              }}
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: 16,
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((link) => (
                <li key={link.label} style={{ marginBottom: 10 }}>
                  <a
                    href={link.href}
                    target={"external" in link ? "_blank" : undefined}
                    rel={"external" in link ? "noopener noreferrer" : undefined}
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "color var(--transition-fast)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-muted)")
                    }
                  >
                    {link.label}
                    {"external" in link && <ExternalLink size={11} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 24px",
        }}
      >
        <div
          className="section-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "var(--text-muted)",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span>© {new Date().getFullYear()} PaperMind AI. Open source under MIT.</span>
          <span>Built with Next.js, FastAPI, and Qdrant</span>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          footer .section-container {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .section-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
