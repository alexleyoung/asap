"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
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
          <Button variant='outline' className='w-full font-semibold'>
            Create (T)
          </Button>
        </DialogTrigger>
        <DialogContent className='md:max-w-[80%] min-w-fit'>
          <DialogHeader>
            <DialogTitle className='sr-only'>Create New Item</DialogTitle>
            <DialogDescription className='sr-only'>
              Create a new item
            </DialogDescription>
          </DialogHeader>
          <CreateItemTabs
          // onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
