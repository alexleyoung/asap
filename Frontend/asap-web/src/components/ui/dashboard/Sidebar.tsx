import { Calendar } from "@/components/ui/calendar";

export default function Sidebar() {
  return (
    <aside className='border-r border-border'>
      <Calendar mode='single' />
    </aside>
  );
}
