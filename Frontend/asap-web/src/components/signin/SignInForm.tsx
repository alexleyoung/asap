"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/lib/scheduleCrud";
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

const formSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function SignInForm({
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
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof formSchema>) => {
    try {
      const token: { access_token: string; token_type: string } = await signIn(
        data.email,
        data.password
      );
      if (token) {
        localStorage.setItem("token", token.access_token);
        const user = await getUserByEmail(data.email);
        setUser(user);
        setSuccess("Signed in successfully");
        router.push("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className='grid h-full place-items-center py-12 border-r'>
      <div className='mx-auto grid w-[350px] gap-6'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>Sign In</h1>
          <p className='text-balance text-muted-foreground'>
            Enter your email below to login to your account
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignIn)}
            className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input id='email' placeholder='m@email.com' {...field} />
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
                      id='password'
                      type='password'
                      placeholder='create a password'
                      {...field}
                    />
                  </FormControl>

                  <Link
                    href='/forgot-password'
                    className='ml-auto inline-block text-sm underline'>
                    Forgot your password?
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {success && <p className='text-green-500 text-sm'>{success}</p>}
            <Button type='submit' className='w-full'>
              Sign In
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
          <Link href='/dashboard'>Sign In with Google</Link>
        </Button>
      </div>
    </div>
  );
}
