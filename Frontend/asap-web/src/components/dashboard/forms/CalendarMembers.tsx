import { Input } from "@/components/ui/input";
import { getMembers } from "@/lib/scheduleCrud";
import { Calendar, Membership } from "@/lib/types";
import { useEffect, useState } from "react";
import { Button } from "react-day-picker";

interface CalendarMembersProps {
  calendar: Calendar;
}

export const CalendarMembers = ({ calendar }: CalendarMembersProps) => {
  const [members, setMembers] = useState<Membership[]>([]);

  useEffect(() => {
    (async () => {
      await getMembers(groupID);
    })();
    setMembers([]);
  }, []);

  return (
    <div>
      <h1>Calendar Members</h1>
      <Input placeholder="Add Member" type="newMember" />
      <div>
        <h2>Edit Members</h2>
        {members.map((member) => (
          <div key={member.id}>
            <span>{member.userID}</span>
            <span>{member.permission}</span>
            <Button>Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
