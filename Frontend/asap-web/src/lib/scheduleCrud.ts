import { permission } from "process";
import {
  User,
  Event,
  Task,
  EventPost,
  TaskPost,
  Calendar,
  CalendarPost,
  Group,
  GroupPost,
  Membership,
} from "./types";

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

export async function getUserByID(userID: number) {
  try {
    const response = await fetch(`http://localhost:8000/users/${userID}`, {
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

export async function deleteUser(userID: number) {
  try {
    const response = await fetch(`http://localhost:8000/users/${userID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the user");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete the user");
    throw error;
  }
}

// Events
export async function getEvents(userID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/events/?userID=${userID}`,
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
    const response = await fetch(`http://localhost:8000/events`, {
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

    return await response;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw error; // Re-throw the error after logging it
  }
}
export async function deleteEvent(eventId: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/events/${eventId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

// Tasks
export async function getTasks(userID: number, limit = 100, offset = 0) {
  try {
    const response = await fetch(
      `http://localhost:8000/tasks?userID=${userID}&limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const res = await response.json();
    return res as { tasks: Task[]; total: number };
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
export async function getCalendars(userID: number) {
  const response = await fetch(
    `http://localhost:8000/calendars?userID=${userID}`,
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
  const calendars = (await response.json()) as Calendar[];
  console.log(calendars);
  return calendars;
}

export async function getCalendar(calendarID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/calendars/${calendarID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return (await response.json()) as Calendar;
  } catch (error) {
    console.error(error);
  }
}

export async function createCalendar(calendar: CalendarPost) {
  try {
    const response = await fetch(`http://localhost:8000/calendars`, {
      method: "POST",
      body: JSON.stringify(calendar),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return (await response.json()) as Calendar;
  } catch (error) {
    console.error("Failed to create calendar:", error);
    throw error;
  }
}

export async function updateCalendar(calendar: Calendar) {
  try {
    const response = await fetch(
      `http://localhost:8000/calendars/${calendar.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(calendar),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating profile:", errorData);

      // Check if errorData has a detail property to give more context
      const errorMessage = errorData.detail
        ? JSON.stringify(errorData.detail)
        : "Failed to update user profile";
      throw new Error(errorMessage);
    }
    return (await response.json()) as Calendar;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCalendar(calendar: Calendar) {
  try {
    const response = await fetch(
      `http://localhost:8000/calendars/${calendar.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete the calendar");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to delete the calendar");
    throw error;
  }
}

// Groups
export async function getGroup(groupID: number) {
  try {
    const response = await fetch(`http://localhost:8000/groups/${groupID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get group");
    }

    return (await response.json()) as Group;
  } catch (error) {
    console.error("Failed to get group");
    throw error;
  }
}

export async function getGroupByCalendarID(calendarID: number) {
  try {
    const response = await fetch(`http://localhost:8000/groups/${calendarID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get group");
    }

    return (await response.json()) as Group;
  } catch (error) {
    console.error("Failed to get group");
    throw error;
  }
}

export async function createGroup(group: GroupPost) {
  try {
    const response = await fetch("http://localhost:8000/groups", {
      method: "POST",
      body: JSON.stringify(group),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create group");
    }

    return (await response.json()) as Group;
  } catch (error) {
    console.error("Failed to create group");
    throw error;
  }
}

export async function getMemberships(userID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/memberships?userID=${userID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get memberships");
    }

    return (await response.json()) as Membership[];
  } catch (error) {
    console.error("Failed to get memberships");
    throw error;
  }
}

export async function addMember(
  groupID: number,
  userID: number,
  permissions: "ADMIN" | "VIEWER" | "EDITOR"
) {
  try {
    const response = await fetch(
      `http://localhost:8000/groups/${groupID}/members`,
      {
        method: "POST",
        body: JSON.stringify({ userID: userID, permission: permissions }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add member to group");
    }

    return (await response.json()) as Membership;
  } catch (error) {
    console.error("Failed to add member to group");
    throw error;
  }
}

export async function getMembers(groupID: number) {
  try {
    const response = await fetch(
      `http://localhost:8000/groups/${groupID}/members`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get members of group");
    }

    const memberships = (await response.json()) as Membership[];
    return memberships;
  } catch (error) {
    console.error("Failed to get members of group");
    throw error;
  }
}

// Auto Schedule
export async function scheduleTask(task: TaskPost) {
  try {
    const response = await fetch("http://localhost:8000/tasks?auto=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    return (await response.json()) as Task;
  } catch (error) {
    console.error("Failed to schedule task:", error);
    throw error;
  }
}
//crud operations for the schedule
