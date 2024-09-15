import { Calendar } from "@/components/ui/calendar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-screen flex-col overflow-hidden'>
      <header className='px-5 py-3 border-b border-border flex justify-between'>
        <h1 className='text-2xl font-bold'>asap.</h1>
      </header>
      <div className='flex flex-grow h-full'>
        <aside className='border-r border-border'>
          <Calendar mode='single' />
        </aside>
        <main className='flex-grow h-full'>{children}</main>
      </div>
    </div>
  );
}
