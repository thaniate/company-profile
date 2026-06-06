import Sidebar from '@/components/admin/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 md:overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
