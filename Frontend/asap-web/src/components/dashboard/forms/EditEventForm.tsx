import { EventFormData } from "@/lib/types";
import React, { use, useEffect, useState } from "react";
import { updateEvent } from "@/lib/scheduleCrud";
import { deleteEvent } from "@/lib/scheduleCrud";

interface EditEventFormProps {
  eventId: number;
  onClose: () => void;
  eventData: EventFormData;
  onSubmit: (updatedEvent: EventFormData) => void;
}
export type OmittedEventFormData = Omit<
  EventFormData,
  "siid" | "uid" | "calendarID" | "type"
>;

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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await deleteEvent(eventId); // Call the delete handler with eventId
        onClose(); // Close the form after deletion
      } catch (error) {
        console.error("Failed to delete event:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the updated event object with the correct types
    const updatedEvent: OmittedEventFormData = {
      title,
      description,
      start,
      end,
      location,
      category: eventData.category, // Ensure this is a string
      frequency: eventData.frequency, // Ensure this is a string
    };

    // Call the update handler
    handleUpdate(updatedEvent);
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
  }, [eventId, deleteEvent]);

  const handleUpdate = async (updatedEvent: OmittedEventFormData) => {
    try {
      setLoading(true);

      // Format start and end to ISO string if required by the backend
      const formattedEvent = {
        title: updatedEvent.title,
        start: updatedEvent.start,
        end: updatedEvent.end,
        description: updatedEvent.description,
        category: updatedEvent.category,
        frequency: updatedEvent.frequency,
        location: updatedEvent.location,
      };
      const response = await updateEvent(formattedEvent, eventId);

      // Check if the response is OK
      if (!response.ok) {
        // Log detailed error information
        const errorDetails = await response.json(); // Assuming the backend returns JSON errors
        console.error("Failed to update event:", errorDetails);
        throw new Error(`Error: ${errorDetails.message || "Unknown error"}`);
      }

      const fullEvent = {
        ...formattedEvent,
        siid: eventId,
        uid: eventData.uid,
        type: eventData.type,
        calendarID: eventData.calendarID,
      };
      onSubmit(fullEvent);
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
      <button type="button" onClick={handleDelete} disabled={loading}>
        Delete Event
      </button>
    </form>
  );
}

export default EditEventForm;
