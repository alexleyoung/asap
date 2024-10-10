import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateItemTabs from "./CreateItemTabs";
import EditEventForm from "./EditEventForm";
import { updateEvent } from "@/lib/scheduleCrud";
import { EventFormData } from "@/lib/types";
import EventCard from "../schedule/EventCard";

export default function CreateItemDialog() {
  const [open, setOpen] = useState(false);

  useHotkeys("t", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full font-semibold">
            Create (T)
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="sr-only">Create New Item</DialogTitle>
            <DialogDescription className="sr-only">
              Create a new item
            </DialogDescription>
          </DialogHeader>
          <CreateItemTabs />
        </DialogContent>
      </Dialog>
    </div>
  );
}
