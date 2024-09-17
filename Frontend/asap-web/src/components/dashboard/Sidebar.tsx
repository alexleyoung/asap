"use client";

import { useCurrentDate } from "@/contexts/ScheduleContext";

import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EventForm } from "./forms/EventForm";
import { TaskForm } from "./forms/TaskForm";
import { useState } from "react";

export default function Sidebar() {
  const { currentDate, setCurrentDate } = useCurrentDate();
  const [activeTab, setActiveTab] = useState("event"); // Manage active tab

  return (
    <aside className="border-r border-border p-2">
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={(day) => {
          if (day) {
            setCurrentDate(day); // only set if day is valid
          }
        }}
      />

      <Separator className="mb-2" />

      <div className="flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {/* Tab Navigation */}
                <div className="tabs">
                  <button
                    className={`px-2 py-1 font-medium ${
                      activeTab === "event"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("event")}
                  >
                    Event
                  </button>
                  <button
                    className={`px-2 py-1 font-medium ${
                      activeTab === "task"
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("task")}
                  >
                    Task
                  </button>
                </div>
                <div className="pt-4 ">Create New Item</div>
              </DialogTitle>
              <DialogDescription>Create a new event or task</DialogDescription>
              {/* Conditional Rendering based on activeTab */}
              <div className="form-content">
                {activeTab === "event" && <EventForm onSubmit={() => {}} />}
                {activeTab === "task" && <TaskForm onSubmit={() => {}} />}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
