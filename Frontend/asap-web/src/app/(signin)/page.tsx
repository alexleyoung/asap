import SignInForm from "@/components/signin/SignInForm";
import SignUpForm from "@/components/signup/SignUpForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-full lg:grid lg:grid-cols-2 h-screen">
      {/* <SignInForm /> */}
      <SignUpForm />
      {/* <Image src="" /> */}
    </main>
  );
}
