"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StickyNote, Plus, Trash2, Search, BookMarked } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  paper_id?: string;
  created_at: Date;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const addNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: newTitle || "Untitled Note",
      content: newContent,
      created_at: new Date(),
    };
    setNotes((prev) => [note, ...prev]);
    setNewTitle("");
    setNewContent("");
    setEditing(null);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Notes & Bookmarks
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {notes.length > 0 && (
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
                  placeholder="Search notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    fontFamily: "inherit",
                    width: 140,
                  }}
                />
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "8px 16px" }}
              onClick={() => setEditing("new")}
            >
              <Plus size={14} />
              New Note
            </button>
          </div>
        </div>

        {/* New note form */}
        {editing === "new" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 20, marginBottom: 16 }}
          >
            <input
              type="text"
              placeholder="Note title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--border)",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "inherit",
                padding: "8px 0",
                marginBottom: 12,
              }}
              autoFocus
            />
            <textarea
              placeholder="Write your notes here..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                outline: "none",
                color: "var(--text-secondary)",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical",
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: "7px 14px" }}
                onClick={() => {
                  setEditing(null);
                  setNewTitle("");
                  setNewContent("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ fontSize: 12, padding: "7px 14px" }}
                onClick={addNote}
              >
                Save Note
              </button>
            </div>
          </motion.div>
        )}

        {/* Notes list */}
        {notes.length === 0 && editing !== "new" ? (
          <div
            className="card"
            style={{ padding: 48, textAlign: "center" }}
          >
            <BookMarked
              size={32}
              color="var(--text-muted)"
              style={{ margin: "0 auto 12px" }}
            />
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 16 }}>
              No notes yet. Create notes to save key findings and insights.
            </p>
            <button
              className="btn btn-primary"
              style={{ fontSize: 13, padding: "9px 20px" }}
              onClick={() => setEditing("new")}
            >
              <Plus size={14} />
              Create First Note
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((note) => (
              <motion.div
                key={note.id}
                layout
                className="card"
                style={{
                  padding: 20,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <StickyNote
                  size={18}
                  color="var(--accent-primary)"
                  style={{ marginTop: 2, flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {note.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {note.content}
                  </p>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, display: "block" }}>
                    {note.created_at.toLocaleString()}
                  </span>
                </div>
                <button
                  className="btn-ghost"
                  style={{ padding: 8, borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                  onClick={() => deleteNote(note.id)}
                  title="Delete note"
                >
                  <Trash2 size={14} color="var(--text-muted)" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
