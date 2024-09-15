import Header from "@/components/ui/dashboard/Header";
import Sidebar from "@/components/ui/dashboard/Sidebar";
import { ScheduleProvider } from "@/contexts/ScheduleContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScheduleProvider>
      <div className='flex h-screen w-screen flex-col overflow-hidden'>
        <Header />
        <div className='flex flex-grow h-full'>
          <Sidebar />
          <main className='flex-grow h-full'>{children}</main>
        </div>
      </div>
    </ScheduleProvider>
  );
}
