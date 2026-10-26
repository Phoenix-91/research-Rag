"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Network, Info, Filter, ZoomIn } from "lucide-react";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const isEmpty = nodes.length === 0;

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Knowledge Graph
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Explore concepts and relationships across your papers
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: "7px 14px" }}
          >
            <Filter size={14} />
            Filter
          </button>
          <button
            className="btn btn-secondary"
            style={{ fontSize: 12, padding: "7px 14px" }}
          >
            <ZoomIn size={14} />
            Fit View
          </button>
        </div>
      </div>

      {/* Graph area */}
      <div style={{ flex: 1, position: "relative" }}>
        {isEmpty ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
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
              }}
            >
              <Network size={26} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>No Graph Data Yet</h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                maxWidth: 400,
                textAlign: "center",
              }}
            >
              Upload and index papers to generate knowledge graphs. Concepts,
              methods, and relationships will appear here.
            </p>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            style={{ background: "var(--bg-main)" }}
          >
            <Background color="var(--border)" gap={32} size={1} />
            <Controls
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            />
            <MiniMap
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
              maskColor="rgba(9, 11, 10, 0.7)"
            />
          </ReactFlow>
        )}

        {/* Node detail panel */}
        {selectedNode && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 280,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: 20,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>
                {String(selectedNode.data?.label ?? "Node")}
              </h3>
              <button
                className="btn-ghost"
                style={{ padding: 4 }}
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <Info size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
              Node details will appear here when graph data is available.
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
