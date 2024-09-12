import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";

export default function SignUpForm() {
  return (
    <div className="grid h-full place-items-center py-12 border-r">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-balance text-muted-foreground">
            Enter your info below to create your account
          </p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="enter first and last name "
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
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="confirmpass">Confirm Password</Label>
            </div>
            <Input id="confirmpass" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
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
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="#" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
