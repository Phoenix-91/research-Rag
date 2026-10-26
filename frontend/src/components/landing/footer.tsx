"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

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
              <GithubIcon size={18} />
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
