"use client";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";
import { signUp } from "../../lib/auth";
import React, { useState } from "react";
import { set } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // function onSubmit(data: z.infer<typeof formSchema>) {
  //   //here is where you would collect the data and send it to the server
  //   fetch("http://localhost:8000/api/auth/signup", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   console.log(data);
  // }
  const handleSignUp = async (data: { email: string; password: string }) => {
    try {
      const response = await signUp(data.email, data.password);
      if (response.ok) {
        // const { token } = await response.json();
        // localStorage.setItem("token", token);
        setError("");
        setSuccess("Account created successfully");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="grid h-full place-items-center py-12 border-r">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Enter your info below to create your account
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp({ email, password });
            }}
            className="space-y-8"
          >
            {/* <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="First Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            {/* <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Last Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="m@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="create a password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="confirmpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}  
            /> */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
        {/* <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="firstname"
              type="firstname"
              placeholder="enter first name "
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Last Name</Label>
            <Input
              id="lastname"
              type="lastname"
              placeholder="enter last name "
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirmpass">Confirm Password</Label>
            </div>
            <Input id="confirmpass" type="password" required />
          </div> */}

        <Separator className="relative my-2">
          <span className="absolute px-2 py-1 bg-background left-[45%] -top-4 text-primary/60">
            or
          </span>
        </Separator>
        <Button variant="outline" className="w-full flex gap-2">
          <FcGoogle size={20} />
          <Link href="/dashboard">Sign Up with Google</Link>
        </Button>
      </div>
    </div>
    // </div>
  );
}
