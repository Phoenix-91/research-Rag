"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Trash2,
  Eye,
  Search,
} from "lucide-react";

interface Paper {
  id: string;
  filename: string;
  title: string;
  status: "uploaded" | "processing" | "indexed" | "failed";
  pages: number;
  uploaded_at: string;
  size_mb: number;
}

const statusConfig = {
  uploaded: { label: "Uploaded", color: "var(--text-muted)", icon: Clock },
  processing: { label: "Processing", color: "var(--warning)", icon: Loader2 },
  indexed: { label: "Indexed", color: "var(--accent-primary)", icon: CheckCircle2 },
  failed: { label: "Failed", color: "var(--error)", icon: AlertCircle },
};

function UploadZone({
  onUpload,
  uploading,
}: {
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragOver ? "var(--accent-primary)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 48,
        textAlign: "center",
        cursor: uploading ? "not-allowed" : "pointer",
        background: dragOver ? "var(--accent-primary-dim)" : "var(--bg-secondary)",
        transition: "all var(--transition-base)",
        opacity: uploading ? 0.6 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        style={{ display: "none" }}
        disabled={uploading}
      />
      {uploading ? (
        <Loader2
          size={36}
          color="var(--accent-primary)"
          style={{ margin: "0 auto 12px", animation: "spin 1s linear infinite" }}
        />
      ) : (
        <Upload
          size={36}
          color={dragOver ? "var(--accent-primary)" : "var(--text-muted)"}
          style={{ margin: "0 auto 12px" }}
        />
      )}
      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>
        {uploading ? "Uploading..." : "Drop a PDF here or click to browse"}
      </p>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Supports PDF files up to 50MB
      </p>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8000/api/v1/papers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const paper = await res.json();
      setPapers((prev) => [paper, ...prev]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDelete = useCallback(async (paperId: string) => {
    try {
      await fetch(`http://localhost:8000/api/v1/papers/${paperId}`, {
        method: "DELETE",
      });
      setPapers((prev) => prev.filter((p) => p.id !== paperId));
    } catch {
      // Will add proper error handling in Phase 4
    }
  }, []);

  const filteredPapers = papers.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
              My Papers
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
              {papers.length} paper{papers.length !== 1 ? "s" : ""} uploaded
            </p>
          </div>
          {papers.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 12px",
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  width: 180,
                }}
              />
            </div>
          )}
        </div>

        {/* Upload zone */}
        <UploadZone onUpload={handleUpload} uploading={uploading} />

        {/* Upload error */}
        <AnimatePresence>
          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                marginTop: 12,
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--error-bg)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "var(--error)",
              }}
            >
              <AlertCircle size={16} />
              {uploadError}
              <button
                onClick={() => setUploadError(null)}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--error)",
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Papers list */}
        {papers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <AnimatePresence>
              {filteredPapers.map((paper) => {
                const st = statusConfig[paper.status];
                return (
                  <motion.div
                    key={paper.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card"
                    style={{
                      padding: 20,
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
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
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} color="var(--accent-primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {paper.title || paper.filename}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 2,
                          display: "flex",
                          gap: 12,
                        }}
                      >
                        <span>{paper.pages} pages</span>
                        <span>{paper.size_mb.toFixed(1)} MB</span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: st.color,
                        fontWeight: 500,
                      }}
                    >
                      <st.icon
                        size={14}
                        style={
                          paper.status === "processing"
                            ? { animation: "spin 1s linear infinite" }
                            : {}
                        }
                      />
                      {st.label}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {paper.status === "indexed" && (
                        <button
                          className="btn-ghost"
                          style={{ padding: 8, borderRadius: "var(--radius-sm)" }}
                          title="View paper"
                        >
                          <Eye size={16} color="var(--text-muted)" />
                        </button>
                      )}
                      <button
                        className="btn-ghost"
                        style={{ padding: 8, borderRadius: "var(--radius-sm)" }}
                        title="Delete paper"
                        onClick={() => handleDelete(paper.id)}
                      >
                        <Trash2 size={16} color="var(--text-muted)" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
