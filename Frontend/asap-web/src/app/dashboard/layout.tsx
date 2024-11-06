import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { CalendarProvider } from "@/contexts/CalendarsContext";
import { ScheduleProvider } from "@/contexts/ScheduleContext";
import { Calendar } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScheduleProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <Header />
        <CalendarProvider>
          <div className="flex flex-grow h-[50%]">
            <Sidebar />
            <main className="flex-grow">{children}</main>
          </div>
        </CalendarProvider>
      </div>
    </ScheduleProvider>
  );
}
