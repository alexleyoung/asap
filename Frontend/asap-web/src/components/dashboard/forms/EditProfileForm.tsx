import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;
  };
  onSave: (updatedUser: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar: string;
  }) => void;
}

const EditProfileForm = ({ user, onSave }: EditProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar,
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [user]);

  const handleSubmit = async (data: Omit<ProfileFormValues, "id">) => {
    try {
      const dataToSend = {
        ...data,
        avatar: data.avatar ?? null, // Send null if avatar is undefined
      };

      console.log("Data to send:", dataToSend); // Debugging info

      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Response:", response);
      console.log("Data:", data);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);

        // Check if errorData has a detail property to give more context
        const errorMessage = errorData.detail
          ? JSON.stringify(errorData.detail)
          : "Failed to update user profile";
        throw new Error(errorMessage);
      }
      console.log("Response: still reading");
      const updatedUser = await response.json();
      onSave({ ...updatedUser, id: user.id });
      localStorage.setItem("User", JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <Input placeholder="enter link to avatar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="secondary">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProfileForm;
