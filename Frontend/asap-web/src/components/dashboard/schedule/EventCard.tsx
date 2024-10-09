import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { EventPost } from "@/types/event";
import React from "react";

interface EventCardProps {
  event: EventPost;
}

export function EventCard({ event }: EventCardProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<EventPost | null>(
    null
  );
  //when event is clicked, data is pulled to display in the card
  const handleClick = (event: EventPost) => {
    setSelectedEvent(event);
  };
  const deleteEvent = (event: EventPost) => {
    //delete event
  };
  const editEvent = (event: EventPost) => {
    //edit event
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>THIS SHOULD BE EVENT TITLE</CardTitle>
        <CardDescription>THIS SHOULD BE EVENT DESCRIPTION</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>THIS SHOULD BE EVENT DATE</CardDescription>
        <CardDescription>THIS SHOULD BE EVENT LOCATION</CardDescription>
      </CardContent>
      <CardFooter>
        <button>Delete</button>
        <button>Edit</button>
      </CardFooter>
    </Card>
  );
}

export default EventCard;
