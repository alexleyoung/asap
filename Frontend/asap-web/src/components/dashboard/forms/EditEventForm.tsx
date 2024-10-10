import { EventFormData } from "@/lib/types";
import React, { use, useEffect, useState } from "react";
import { updateEvent } from "@/lib/scheduleCrud";

interface EditEventFormProps {
  eventId: string;
  onClose: () => void;
  eventData: EventFormData;
  onSubmit: (updatedEvent: EventFormData) => void;
}

export function EditEventForm({
  eventId,
  onClose,
  eventData,
  onSubmit,
}: EditEventFormProps) {
  const [title, setTitle] = useState(eventData.title);
  const [description, setDescription] = useState(eventData.description);
  const [start, setStartDate] = useState(eventData.start);
  const [end, setEndDate] = useState(new Date(eventData.end));
  const [location, setLocation] = useState(eventData.location);
  const [loading, setLoading] = useState(false);
  const [newEventData, setEventData] = useState<EventFormData | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEvent = {
      ...eventData,
      title,
      description,
      start,
      end,
      location,
    };
    onSubmit(updatedEvent); // call the submit handler
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  const handleUpdate = async (updatedEvent: EventFormData) => {
    try {
      setLoading(true);
      await updateEvent(updatedEvent);
      onSubmit(updatedEvent);
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={start.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
      </div>
      <div>
        <label>End Date</label>
        <input
          type="date"
          value={end.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </div>
      <div>
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditEventForm;
