import Sidebar from "@/components/admin/Sidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:ms-72 min-h-screen pt-16 lg:pt-0">{children}</div>
    </div>
  );
}