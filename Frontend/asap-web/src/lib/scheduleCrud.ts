import { EventFormData } from "./types";

export async function createItem(
  user: { id: string },
  itemData: EventFormData | TaskFormData
) {
  const isEvent = "location" in itemData;
  const isTask = "priority" in itemData;

  if (!isEvent && !isTask) {
    throw new Error("Invalid item data");
  }

  let data;
  let response;
  if (isEvent) {
    response = await fetch(`http://localhost:8000/users/${user.id}/events`, {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    data = await response.json();
  } else {
    response = await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(itemData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    data = await response.json();
  }

  if (!response?.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

export async function deleteEvent(event: CalendarEvent) {
  try {
    const response = await fetch(
      `/api/events/${event.id}?userId=${event.user_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete event:", error);
    throw error; // Re-throw the error after logging it
  }
}

export async function deleteTask(task: Task) {
  try {
    const response = await fetch(
      `/api/tasks/${task.id}?userId=${task.user_id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error; // Re-throw the error after logging it
  }
}

type ScheduleData = {
  events: CalendarEvent[];
  tasks: Task[];
};
export async function generateSchedule({ events, tasks }: ScheduleData) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ events, tasks }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Something went wrong");
  }

  return await response.json();
}
