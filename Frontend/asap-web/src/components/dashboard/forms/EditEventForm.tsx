import { EventFormData } from "@/lib/types";
import React, { useState } from "react";

interface EditEventFormProps {
  eventData: EventFormData; // event data to prefill the form
  onSubmit: (updatedEvent: EventFormData) => void;
}

export function EditEventForm({ eventData, onSubmit }: EditEventFormProps) {
  const [title, setTitle] = useState(eventData.title);
  const [description, setDescription] = useState(eventData.description);
  const [start, setStartDate] = useState(eventData.start);
  const [end, setEndDate] = useState(new Date(eventData.end));
  const [location, setLocation] = useState(eventData.location);

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
