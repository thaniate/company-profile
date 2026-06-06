import Sidebar from "@/components/admin/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-56">
        <div className="min-h-screen pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
