import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
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
        <div className='flex flex-grow h-[90%]'>
          <Sidebar />
          <main className='flex-grow'>{children}</main>
        </div>
      </div>
    </ScheduleProvider>
  );
}
