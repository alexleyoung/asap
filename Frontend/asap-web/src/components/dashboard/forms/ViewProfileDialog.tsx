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

interface ProfileViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;

    // Add other profile fields as needed
  };
  onClose: () => void; // Function to close or hide the profile view
  onUpdate: (updatedUser: {
    id: string;
    name: string;
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
    name: string;
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
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </DialogDescription>
          <DialogFooter>
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
