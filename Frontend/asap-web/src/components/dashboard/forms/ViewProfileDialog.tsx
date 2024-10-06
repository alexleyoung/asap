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

interface ProfileViewProps {
  user: {
    name: string;
    email: string;
    // Add other profile fields as needed
  };
  onClose: () => void; // Function to close or hide the profile view
}

export const ViewProfileDialog = ({ user, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser) => {
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
                <Button variant="danger">Delete Profile</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure you want to delete your profile?
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
