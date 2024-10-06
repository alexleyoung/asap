import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input"; // Adjust the import path for Shadcn UI Input
import { Button } from "@/components/ui/button";

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
  };
  onSave: (updatedUser: { name: string; email: string }) => void;
}

const EditProfileForm = ({ user, onSave }: EditProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  useEffect(() => {
    setFormData({ name: user.name, email: user.email });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
      <FormField
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </form>
  </Form>on type="submit">Save</Button>
    </Form>
  );
};

export default EditProfileForm;
