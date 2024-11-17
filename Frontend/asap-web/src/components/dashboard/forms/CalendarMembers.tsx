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
  addMember,
  createGroup,
  getGroupByCalendarID,
  getMembers,
  getUserByEmail,
} from "@/lib/scheduleCrud";
import { Calendar, Group, Membership } from "@/lib/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!calendar) return;

    (async () => {
      try {
        let group = await getGroupByCalendarID(calendar.id);
        if (!group) {
          group = await createGroup({
            title: calendar.name,
            calendarID: calendar.id,
          });
        }
        setGroup(group);
      } catch (error) {
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
    console.log("hello");

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
