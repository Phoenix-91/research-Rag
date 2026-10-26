import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflow: "auto",
          background: "var(--bg-main)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
