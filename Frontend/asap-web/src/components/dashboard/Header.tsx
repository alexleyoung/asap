"use client";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";
import { addDays, addMonths, format, set } from "date-fns";
import { useHotkeys } from "react-hotkeys-hook";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { ViewProfileDialog } from "@/components/dashboard/forms/ViewProfileDialog";
import { ManageCalendarsDialog } from "./forms/ManageCalendarsDialog";
import { getCalendars } from "@/lib/scheduleCrud";
import { useCalendars } from "@/contexts/CalendarsContext";
import { Calendar } from "@/lib/types";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
}

export default function Header() {
  const { view, setView } = useView();
  const { currentDate, setCurrentDate } = useCurrentDate();
  const router = useRouter();
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isOpenManageCalendars, setIsOpenManageCalendars] = useState(false);
  const [calendar, setCalendar] = useState<any>(null);
  const [calendars, setCalendars] = useState<any>([]);
  const { selectedCalendars, toggleCalendar } = useCalendars();

  useEffect(() => {
    const storedUser = localStorage.getItem("User");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);

        localStorage.removeItem("data");
        router.push("/");
      }
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, []);

  const loadCalendars = async () => {
    try {
      if (!user) return;
      const response = await getCalendars(user.id);
      setCalendars(response);
      console.log(calendars);
    } catch (error) {
      console.error("Failed to fetch calendars:", error);
    }
    setIsOpenManageCalendars(true);
  };

  const handleUpdateCalendar = (updatedCalendar: any) => {
    setCalendars((prevCalendars: any[]) =>
      prevCalendars.map((calendar: any) =>
        calendar.id === updatedCalendar.id ? updatedCalendar : calendar
      )
    );
  };

  const handleDeleteCalendar = async (calendar: any) => {
    try {
      const deleteCalendar = calendar;
      const response = await fetch(
        `http://localhost:8000/calendars/calendars/${calendar.id}`,
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

      setCalendars((prevCalendars: any[]) =>
        prevCalendars.filter(
          (calendar: any) => calendar.id !== deleteCalendar.id
        )
      );

      toggleCalendar(deleteCalendar);

      console.log("Calendar and associated events deleted successfully.");
    } catch (error) {
      console.error("Error deleting calendar and events:", error);
    }
  };

  const handleViewChange = (newView: string) => {
    setView(newView);
  };

  const handleDateChange = (direction: "prev" | "next") => {
    if (view === "day") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -1 : 1)
      );
    } else if (view === "week") {
      setCurrentDate((prevDate) =>
        addDays(prevDate, direction === "prev" ? -7 : 7)
      );
    } else {
      setCurrentDate((prevDate) =>
        addMonths(prevDate, direction === "prev" ? -1 : 1)
      );
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    // localStorage.removeItem("User");
    router.push("/");
  };

  const handleDelete = async () => {
    try {
      if (!user) return;

      const response = await fetch(
        `http://localhost:8000/users/${user.id}/delete`, // Adjust the endpoint if needed
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the profile");
      }
      setUser(null);
      router.push("/");
      localStorage.removeItem("User");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <header className='px-5 py-3 border-b border-border flex items-center justify-between'>
      <h1 className='text-2xl font-bold'>asap.</h1>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex gap-4 items-center'>
          <ChevronLeft
            size={32}
            className='rounded-full hover:bg-muted p-1 transition-colors'
            onClick={() => handleDateChange("prev")}
          />
          <ChevronRight
            size={32}
            className='rounded-full hover:bg-muted p-1 transition-colors'
            onClick={() => handleDateChange("next")}
          />
          <Button variant='outline' onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <h2 className='font-medium text-xl'>
            {view === "day"
              ? format(currentDate, "MMMM d, yyyy")
              : format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className='flex gap-2'>
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger>
              <SelectValue placeholder='View' className='text-sm' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='day'>Day</SelectItem>
              <SelectItem value='week'>Week</SelectItem>
              <SelectItem value='month'>Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        {user && (
          <Popover>
            <PopoverTrigger>
              <Avatar className='hover:cursor-pointer relative group'>
                <div className='absolute size-12 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-all' />
                <AvatarImage src={user.avatar} alt={user.firstname} />
                <AvatarFallback>{user.firstname[0]}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={5}
              className='mr-4 p-2 flex flex-col gap-4 text-sm'>
              <h1 className='px-2 pt-1 font-medium'>Hi {user.firstname}!</h1>
              <Separator />
              <Button
                variant='ghost'
                className='w-full text-left px-2 py-2 font-normal items-center justify-start'
                onClick={() => setIsOpenProfile(true)}>
                View Profile
              </Button>
              <Button
                variant='ghost'
                className='w-full text-left px-2 py-2 font-normal items-center justify-start'
                onClick={loadCalendars}>
                Manage Calendars
              </Button>

              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant='ghost'
                    className='w-full text-left px-2 py-2 font-normal items-center justify-start'>
                    Sign Out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Click continue to sign out of your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ThemeSelector />
            </PopoverContent>
          </Popover>
        )}

        {isOpenProfile && user && (
          <ViewProfileDialog
            user={user}
            onClose={() => setIsOpenProfile(false)}
            onUpdate={(updatedUser) => setUser(updatedUser)}
            onDelete={handleDelete}
          />
        )}
        {isOpenManageCalendars && (
          <ManageCalendarsDialog
            calendars={calendars} // Pass the actual calendars here
            onClose={() => setIsOpenManageCalendars(false)}
            onUpdate={(updatedCalendar) => {
              handleUpdateCalendar(updatedCalendar);
            }}
            onDelete={(deletedCalendar) => {
              handleDeleteCalendar(deletedCalendar);
            }}
          />
        )}
      </div>
    </header>
  );
}
