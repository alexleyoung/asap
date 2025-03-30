"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import Image from "next/image";

import SignInForm from "@/components/signin/SignInForm";
import SignUpForm from "@/components/signup/SignUpForm";

export default function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { setUser } = useUser();

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <main className='w-full lg:grid lg:grid-cols-2 h-screen'>
      {isSignIn ? (
        <div className='h-full'>
          <SignInForm setUser={setUser} />
          <div className='-mt-24 text-center text-sm'>
            Don&apos;t have an account?{" "}
            <Link href='#' className='underline' onClick={toggleForm}>
              Sign Up
            </Link>
          </div>{" "}
        </div>
      ) : (
        <div className='h-full'>
          <SignUpForm setUser={setUser} />
          <div className='-mt-24 text-center text-sm'>
            Already have an account?{" "}
            <Link href='#' className='underline' onClick={toggleForm}>
              Sign In
            </Link>
          </div>
        </div>
      )}
      <Image
        src='/images/signin.svg'
        alt='image here'
        width={500}
        height={500}
        className='hidden lg:block'
      />
    </main>
  );
}
