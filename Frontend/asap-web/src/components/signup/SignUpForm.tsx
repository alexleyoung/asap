"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from "../../lib/auth";
import { createCalendar, getUserByEmail } from "@/lib/scheduleCrud";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    email: z.string().email().min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain a special character"
      ),
    confirmpassword: z.string().min(1, "Confirm Password is required"),
    firstname: z.string().min(1, "First Name is required"),
    lastname: z.string().min(1, "Last Name is required"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match",
  });

export default function SignUpForm({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const handleSignUp = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await signUp(
        data.firstname,
        data.lastname,
        data.email,
        data.password
      );

      if (response) {
        // Check if the response is valid, change the condition
        setError("");
        setSuccess("Account created successfully");
        const user = await getUserByEmail(data.email);
        setUser(user);
        await createCalendar({
          name: "Personal",
          description: "Default personal calendar",
          timezone: "",
          userID: user.id,
          color: "blue",
        });
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccess("");
      console.error(error); // Log the actual error
    }
  };

  return (
    <div className='grid h-full place-items-center py-12 border-r'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>Sign Up</h1>
          <p className='text-balance text-muted-foreground'>
            Enter your info below to create your account
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className='space-y-8'>
            <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='firstname'
                      type='text'
                      placeholder='First Name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='lastname'
                      type='text'
                      placeholder='Last Name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='email'
                      type='email'
                      placeholder='m@email.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='password'
                      type='password'
                      placeholder='create a password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmpassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='confirmpassword'
                      type='password'
                      placeholder='confirm password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {success && <p className='text-green-500 text-sm'>{success}</p>}
            <Button type='submit' className='w-full'>
              Sign Up
            </Button>
          </form>
        </Form>

        <Separator className='relative my-2'>
          <span className='absolute px-2 py-1 bg-background left-[45%] -top-4 text-primary/60'>
            or
          </span>
        </Separator>
        <Button variant='outline' className='w-full flex gap-2'>
          <FcGoogle size={20} />
          <Link href='/dashboard'>Sign Up with Google</Link>
        </Button>
      </div>
    </div>
  );
}
