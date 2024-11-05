import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EditProfileForm from "./EditProfileForm";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileViewProps {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;

    // Add other profile fields as needed
  };
  onClose: () => void; // Function to close or hide the profile view
  onUpdate: (updatedUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;
  }) => void; // Function to update user
  onDelete: () => void; // Function to delete user
}

export const ViewProfileDialog = ({
  user,
  onClose,
  onUpdate,
  onDelete,
}: ProfileViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;
  }) => {
    onUpdate(updatedUser); // Call the function passed in props to update the user
    setIsEditing(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <DialogDescription>
            {isEditing ? (
              <EditProfileForm user={user} onSave={handleSave} />
            ) : (
              <div>
                <div className="flex justify-center">
                  <Avatar className="hover:cursor-pointer relative group w-24 h-24">
                    <div className="absolute size-12 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-all" />
                    <AvatarImage
                      src={user.avatar}
                      alt={user.firstname}
                      className="rounded-full w-full h-full" // Ensure image fits the Avatar size
                    />
                    <AvatarFallback className="w-full h-full flex items-center justify-center">
                      {user.firstname[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <br />
                <div>
                  Name: {user.firstname} {user.lastname}
                </div>
                <br />
                <div>Email: {user.email}</div>
                <br />
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
            {isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">Delete Profile</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure you want to delete your profile?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
