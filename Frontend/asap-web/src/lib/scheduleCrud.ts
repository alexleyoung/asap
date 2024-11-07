import { User, Event, Task, EventPost, TaskPost } from "./types";

// Users
export async function getUserByEmail(email: string) {
  try {
    const response = await fetch(`http://localhost:8000/users/email/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return (await response.json()) as User;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error; // Re-throw the error after logging it
  }
}

// Events
export async function getEvents(userID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/events?userID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return (await response.json()) as Event[];
  } catch (error) {
    console.error(error);
  }
}

export async function createEvent(event: EventPost) {
  try {
    const response = await fetch("http://localhost:8000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error; // Re-throw the error after logging it
  }
}

export async function updateEvent(event: Event) {
  try {
    const response = await fetch(`http://localhost:8000/events/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // if (!response.ok) {
    //   const data = await response.json();
    //   console.log("Error updating event:", data);
    //   throw new Error(data.error || "Something went wrong");
    // }

    // return await response.json();
    return await response;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw error; // Re-throw the error after logging it
  }
}
export async function deleteEvent(eventId: number) {
  try {
    const response = await fetch(`http://localhost:8000/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

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

// Tasks
export async function getTasks(userID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/tasks?userID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return (await response.json()) as Task[];
  } catch (error) {
    console.error(error);
  }
}

export async function createTask(task: TaskPost) {
  try {
    const response = await fetch("http://localhost:8000/tasks", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return (await response.json()) as Task;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error; // Re-throw the error after logging it
  }
}

export async function updateTask(task: Task) {
  try {
    const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return (await response.json()) as Task;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error; // Re-throw the error after logging it
  }
}

export async function deleteTask(task: Task) {
  try {
    const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return (await response.json()) as Task;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error; // Re-throw the error after logging it
  }
}

// Calendars
export async function fetchCalendars(userId: string) {
  const response = await fetch(
    `http://localhost:8000/users/${userId}/calendars`
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Something went wrong");
  }

  return await response.json();
}

// Schedule
type ScheduleData = {
  events: Event[];
  tasks: Task[];
};
export async function generateSchedule({ events, tasks }: ScheduleData) {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ events, tasks }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Something went wrong");
  }

  return await response.json();
}

export async function fetchCalendars(userId: string) {
  const response = await fetch(
    `http://localhost:8000/calendars/calendars/?userID=${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Something went wrong");
  }

  return await response.json();
}
