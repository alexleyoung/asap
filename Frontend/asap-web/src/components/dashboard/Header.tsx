"use client";
import { useCurrentDate, useView } from "@/contexts/ScheduleContext";
import { addDays, addMonths, format, set } from "date-fns";
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
import { usePathname, useRouter } from "next/navigation";
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
import { use, useEffect, useState } from "react";
import { ViewProfileDialog } from "@/components/dashboard/forms/ViewProfileDialog";
import { ManageCalendarsDialog } from "./forms/ManageCalendarsDialog";
import { deleteCalendar, deleteUser, getCalendars } from "@/lib/scheduleCrud";
import { useCalendars } from "@/contexts/CalendarsContext";
import { useUser } from "@/contexts/UserContext";
import { Calendar } from "@/lib/types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { view, setView } = useView();
  const { currentDate, setCurrentDate } = useCurrentDate();
  const router = useRouter();
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const { user, setUser } = useUser();
  const [isOpenManageCalendars, setIsOpenManageCalendars] = useState(false);
  const { calendars, setCalendars, toggleCalendar } = useCalendars();
  const pathname = usePathname();
  const isCalendar = pathname === "/dashboard";
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);

  //open invite websocket to be able to recieve invites
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/invitations");

    ws.onopen = () => {
      console.log("Connected to WebSocket for invitations");
    };

    ws.onmessage = (event) => {
      const invitation = JSON.parse(event.data);

      if (invitation.type === "member_added") {
        // Trigger the toast globally
        //this is something that cannot be used here, since you cannot have two user ids in local storage.
        // const loggedInUser = JSON.parse(localStorage.getItem("User") || "{}");
        // if (invitation.userID === loggedInUser.id) {
        toast({
          title: "Invitation!",
          description: `You have been invited to join ${invitation.calendarName}`,
          action: (
            <div className='flex gap-2'>
              <button
                className='bg-green-500 text-white px-2 py-1 rounded'
                onClick={() =>
                  handleInvitationResponse("accept", invitation.data)
                }>
                Accept
              </button>
              <button
                className='bg-red-500 text-white px-2 py-1 rounded'
                onClick={() =>
                  handleInvitationResponse("deny", invitation.data)
                }>
                Deny
              </button>
            </div>
          ),
          duration: 10000,
        });
      }
      //}
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  function handleInvitationResponse(response: "accept" | "deny", data: any) {
    if (response === "accept") {
      ws?.send(
        JSON.stringify({
          action: "accept_invitation",
          data: {
            id: data.id,
          },
        })
      );
    } else {
      ws?.send(
        JSON.stringify({
          action: "reject_invitation",
          data: {
            id: data.id,
          },
        })
      );
    }
  }

  const loadCalendars = async () => {
    try {
      if (!user) return;
      const calendars = await getCalendars(user.id);
      setCalendars(calendars);
    } catch (error) {
      console.error("Failed to fetch calendars:", error);
    }
    setIsOpenManageCalendars(true);
  };

  const handleUpdateCalendar = (updatedCalendar: Calendar) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((calendar) =>
        calendar.id === updatedCalendar.id ? updatedCalendar : calendar
      )
    );
  };

  const handleDeleteCalendar = async (calendar: Calendar) => {
    try {
      await deleteCalendar(calendar);
      setCalendars((prevCalendars) =>
        prevCalendars.filter((calendar) => calendar.id !== calendar.id)
      );

      toggleCalendar(calendar);

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
    localStorage.removeItem("User");
    router.push("/");
  };

  const handleDelete = async () => {
    try {
      if (!user) return;

      deleteUser(user.id);
      setUser(null);
      router.push("/");
      localStorage.removeItem("User");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <header className='px-5 py-3 border-b border-border flex items-center justify-between'>
      <Link className='text-2xl font-bold' href='/dashboard'>
        asap.
      </Link>
      {isCalendar && (
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
            <Button
              variant='outline'
              onClick={() => setCurrentDate(new Date())}>
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
      )}
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
