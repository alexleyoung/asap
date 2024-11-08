import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "@/lib/types"; // Import the Event type

interface EventCardProps {
  event: Event;
  onDelete: (eventId: number) => void;
  onUpdate: (updatedEvent: Event) => void;
}

export function EventCard({ event, onDelete, onUpdate }: EventCardProps) {
  const handleDelete = () => {
    onDelete(event.id);
  };

  const handleEdit = () => {
    // You might want to open an edit form or dialog here
    // For now, we'll just call onUpdate with the same event
    onUpdate(event);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>Start: {event.start.toLocaleString()}</CardDescription>
        <CardDescription>End: {event.end.toLocaleString()}</CardDescription>
        <CardDescription>Location: {event.location}</CardDescription>
        <CardDescription>Category: {event.category}</CardDescription>
      </CardContent>
      <CardFooter>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
      </CardFooter>
    </Card>
  );
}

export default EventCard;
