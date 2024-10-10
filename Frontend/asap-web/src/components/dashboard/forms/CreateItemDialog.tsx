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

const fetchEventDetails = async (eventId: string) => {
  try {
    const response = await fetch(`http://localhost:8000/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }
    const eventDetails: EventFormData = await response.json();
    return eventDetails;
  } catch (error) {
    console.error("Failed to fetch event details:", error);
    return null;
  }
};

const fetchEvents = async () => {
  try {
    const storedUser = localStorage.getItem("User");
    const userID = storedUser ? JSON.parse(storedUser).id : null;
    if (!userID) {
      throw new Error("User ID is null");
    }
    const response = await fetch(
      `http://localhost:8000/users/${userID}/events`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();

    return data.map((item: any) => ({
      siid: item.id,
      title: item.title,
      start: new Date(item.start),
      end: new Date(item.end),
      description: item.description || "",
      category: item.category || "",
      frequency: item.frequency || "",
      location: item.location || "",
    }));
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
};

export default function CreateItemDialog() {
  const [open, setOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [events, setEvents] = useState<EventFormData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | null>(
    null
  );
  const [eventsFetched, setEventsFetched] = useState(false); // Track if events have been fetched
  const [editOpen, setEditOpen] = useState(false);

  useHotkeys("t", (e) => {
    e.preventDefault();
    setOpen(true);
  });

  useEffect(() => {
    const getEvents = async () => {
      const fetchedEvents = await fetchEvents();
      setEvents(fetchedEvents);
      setEventsFetched(true); // Mark events as fetched
    };

    // Fetch events only when the event dialog opens and if they haven't been fetched yet
    if (eventOpen && !eventsFetched && !editOpen) {
      getEvents();
    }
  }, [eventOpen]); // Dependency array only has eventOpen

  const handleEventClick = async (eventId: string) => {
    const eventDetails = await fetchEventDetails(eventId);
    console.log("Event details:", eventDetails);
    if (eventDetails) {
      setSelectedEvent(eventDetails);
      console.log("Selected event:", eventDetails); // Log the correct event details
      setEditOpen(true);
    }
  };

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

      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full font-semibold">
            Event
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="sr-only">Edit Events</DialogTitle>
            <DialogDescription className="sr-only">
              Click an event to edit or delete
            </DialogDescription>
          </DialogHeader>
          <ul>
            {events.map((event) => (
              <li key={event.siid}>
                <Button
                  variant="outline"
                  onClick={() => handleEventClick(event.siid.toString())}
                  className="w-full my-2"
                >
                  {event.title}
                </Button>
              </li>
            ))}
          </ul>
          {selectedEvent && editOpen && (
            <div>
              <h3>Edit Event: {selectedEvent.title}</h3>
              <EditEventForm
                eventId={selectedEvent.siid.toString()}
                onClose={() => {
                  setEditOpen(false);
                  setEventOpen(false);
                  setSelectedEvent(null); // Clear selection when closing
                }}
                onSubmit={() => updateEvent(selectedEvent)}
                eventData={selectedEvent}
              />
              <Button
                variant="destructive"
                onClick={() => {
                  alert(`Delete event: ${selectedEvent.title}`);
                  setSelectedEvent(null); // Clear after deletion
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
