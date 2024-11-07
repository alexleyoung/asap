import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import { CalendarProvider } from "@/contexts/CalendarsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ScheduleProvider>
        <CalendarProvider>
          <div className='flex h-screen w-screen flex-col overflow-hidden'>
            <Header />
            <div className='flex flex-grow h-[50%]'>
              <Sidebar />
              <main className='flex-grow'>{children}</main>
            </div>
          </div>
        </CalendarProvider>
      </ScheduleProvider>
    </UserProvider>
  );
}
