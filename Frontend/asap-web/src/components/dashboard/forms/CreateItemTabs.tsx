import { DialogHeader } from "@/components/ui/dialog";
import { EventForm } from "../forms/EventForm";
import { TaskForm } from "../forms/TaskForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface createItemTabsProps {}

export default function CreateItemTabs() {
  return (
    <Tabs defaultValue='event' className='w-full'>
      <DialogHeader>
        <TabsList className='w-full flex mt-6'>
          <TabsTrigger value='event' className='flex-1'>
            <span>Event</span>
          </TabsTrigger>
          <TabsTrigger value='task' className='flex-1'>
            <span>Task</span>
          </TabsTrigger>
        </TabsList>
      </DialogHeader>
      <TabsContent value='event'>
        <EventForm onSubmit={() => {}} />
      </TabsContent>
      <TabsContent value='task'>
        <TaskForm onSubmit={() => {}} />
      </TabsContent>
    </Tabs>
  );
}