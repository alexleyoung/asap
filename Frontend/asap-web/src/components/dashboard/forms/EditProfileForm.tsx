import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Adjust the import path as necessary
import { Input } from "@/components/ui/input"; // Adjust the import path for Shadcn UI Input
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form"; // Import useForm from React Hook Form

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
  };
  onSave: (updatedUser: { name: string; email: string }) => void;
}

const EditProfileForm = ({ user, onSave }: EditProfileFormProps) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // Reset form values when user prop changes
    reset({ name: user.name, email: user.email });
  }, [user, reset]);

  const onSubmit = (data: { name: string; email: string }) => {
    onSave(data); // Call onSave with form data
  };

  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...register("name")} // Register the input with react-hook-form
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
                  {...register("email")} // Register the input with react-hook-form
                  placeholder="Enter your email"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
