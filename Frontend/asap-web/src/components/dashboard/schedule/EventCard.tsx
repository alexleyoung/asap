import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditEventForm } from "@/components/dashboard/forms/EditEventForm";
import { EventFormData } from "@/lib/types";

interface EventCardProps {
  event: EventFormData;
  onDelete: (eventId: string) => void;
  onUpdate: (updatedEvent: EventFormData) => void; // callback to update the event
  onClose: () => void;
}

export function EventCard({
  event,
  onDelete,
  onUpdate,
  onClose,
}: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = (updatedEvent: EventFormData) => {
    onUpdate(updatedEvent);
    setIsEditing(false); // close edit form after saving
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      {isEditing ? (
        <EditEventForm
          eventData={event}
          onSubmit={handleSaveChanges}
          eventId={event.siid}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ) : (
        <CardContent>
          <CardDescription>
            Start Date: {event.start.toISOString()}
          </CardDescription>
          <CardDescription>
            End Date: {event.end.toLocaleDateString()}
          </CardDescription>
          <CardDescription>Location: {event.location}</CardDescription>
        </CardContent>
      )}
      <CardFooter>
        <button onClick={() => onDelete(event.siid.toString())}>Delete</button>
        {!isEditing && <button onClick={handleEditClick}>Edit</button>}
      </CardFooter>
    </Card>
  );
}

export default EventCard;
