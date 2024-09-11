"use client";

import { useState, useEffect } from "react";
import { addHours } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EventForm, EventFormData } from "./EventForm";
import TaskCreationForm from "./CreateTaskDialog";

type CreateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  initialDate: Date | null;
  onCreateItem: (item: EventFormData | TaskFormData) => void;
};

export function CreateDialog({
  isOpen,
  onClose,
  initialDate,
  onCreateItem,
}: CreateDialogProps) {
  const [activeTab, setActiveTab] = useState<"event" | "task">("event");

  const initialData = {
    user_id: String(user?.id) || "invalid",
    start_date: initialDate || new Date(),
    end_date: initialDate
      ? new Date(addHours(initialDate, 1))
      : new Date(Date.now() + 60 * 60 * 1000),
  };

  const handleCreate = (data: EventFormData | TaskFormData) => {
    onCreateItem(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] md:max-w-[640px] lg:max-w-[864px]'>
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>Create new schedule item</DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "event" | "task")}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='event'>Event</TabsTrigger>
            <TabsTrigger value='task'>Task</TabsTrigger>
          </TabsList>
          <TabsContent value='event'>
            <EventForm onSubmit={handleCreate} initialData={initialData} />
          </TabsContent>
          <TabsContent value='task'>
            <TaskCreationForm
              user={user!}
              onSubmit={handleCreate}
              initialData={initialData}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
