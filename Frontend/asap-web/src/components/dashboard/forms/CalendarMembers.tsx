"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  deleteMember,
  addMember,
  createGroup,
  getGroupByCalendarID,
  getMembers,
  getUserByEmail,
} from "@/lib/scheduleCrud";
import { Calendar, Group, Membership } from "@/lib/types";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CalendarMembersProps {
  calendar: Calendar;
}

export const CalendarMembers = ({ calendar }: CalendarMembersProps) => {
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState<Membership[]>([]);
  const [newMemberPermisison, setNewMemberPermisison] = useState<
    "ADMIN" | "VIEWER" | "EDITOR"
  >("VIEWER");
  const [group, setGroup] = useState<Group | null>(null);
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/invitations`);

    ws.onopen = () => {
      console.log("Connected to WebSocket Invitations");
    };

    ws.onmessage = (user) => {
      console.log("Received message:", user.data);
      const invitation = JSON.parse(user.data);

      if (invitation.type === "invitation_accepted") {
        setMembers((prevMembers) => {
          return prevMembers.map((member) => {
            if (member.id === invitation.data.id) {
              const updatedMember = {
                ...member,
                status: "ACCEPTED",
              };

              return updatedMember;
            }
            return member;
          });
        });
      }

      if (invitation.type === "invitation_rejected") {
        setMembers((prevMembers) => {
          return prevMembers.filter(
            (member) => member.id !== invitation.data.id
          );
        });
        handleDeleteMember(invitation.data.groupID, invitation.data.memberID);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");

      // Reconnect only if the connection is closed and it's not already reconnecting
      setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.log("Attempting to reconnect...");
          // Open a new WebSocket connection only if the previous one was closed
          const newWs = new WebSocket(`ws://localhost:8000/invitations`);
          setWs(newWs); // Update the state with the new WebSocket connection
        }
      }, 5000);
    };

    // Set the WebSocket instance in state
    setWs(ws);

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, []);

  async function handleDeleteMember(groupID: number, memberID: number) {
    if (!group) {
      return;
    }
    try {
      await deleteMember(groupID, memberID);
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (!calendar) return;

    console.log("Calendar changed, loading group...");
    (async () => {
      try {
        console.log("Loading group...");
        let group;
        try {
          group = await getGroupByCalendarID(calendar.id);
        } catch (error) {
          console.log("Group not found, proceeding to create one");
        }

        if (!group) {
          console.log("Creating a new group...");
          group = await createGroup({
            title: calendar.name,
            calendarID: calendar.id,
          });
        }

        setGroup(group);
      } catch (error) {
        console.error("Error occurred:", error);
        toast({
          title: "Error",
          description: "Failed to load group",
          duration: 3000,
        });
      }
    })();
  }, [calendar, toast]);

  useEffect(() => {
    if (!group) return;

    (async () => {
      setMembers(await getMembers(group.id));
    })();
  }, [group]);

  const handleSubmit = async () => {
    if (!newMember) return;
    if (!group) return;
    // if(membership.permissions !== "ADMIN") {
    //   toast({
    //     title: "Error",
    //     description: "You do not have permission to add members",
    //     duration: 3000,
    //   });
    //   return;
    // }

    const user = await getUserByEmail(newMember);
    if (!user) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const membership = await addMember(
        group.id,
        user.id,
        newMemberPermisison
      );
      setMembers((prevMembers) => [...prevMembers, membership]);
      setNewMember("");
      ws?.send(
        JSON.stringify({
          action: "add_member",
          data: membership,
          calendarName: calendar.name,
        })
      );
    } catch (error) {
      console.error("Failed to add member:", error);
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1>Calendar Members</h1>
        <div className="w-full grid grid-cols-12 gap-2">
          <Input
            placeholder="Enter member email"
            type="newMember"
            onChange={(e) => setNewMember(e.target.value)}
            className="col-span-7"
          />
          <Select
            defaultValue="VIEWER"
            onValueChange={(value: "ADMIN" | "EDITOR" | "VIEWER") =>
              setNewMemberPermisison(value)
            }
          >
            <SelectTrigger className="col-span-4">
              <SelectValue placeholder="Permissions" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Permissions</SelectLabel>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Plus
            className="hover:bg-muted size-9 p-1 rounded-full"
            onClick={handleSubmit}
          />
        </div>
      </div>
      <div className="space-y-2 w-full">
        <h2>Edit Members</h2>
        <div className="flex flex-col gap-2 w-full">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex gap-2 items-center justify-between w-full"
            >
              <span>{member.userID}</span>
              <span>{member.permission}</span>
              <Button>Edit</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
