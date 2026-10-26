import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperMind AI — Research Intelligence Platform",
  description:
    "Upload research papers, ask better questions, uncover connections, and understand academic research with your personal AI research assistant.",
  keywords: [
    "research",
    "AI",
    "papers",
    "RAG",
    "knowledge graph",
    "academic",
    "research assistant",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
