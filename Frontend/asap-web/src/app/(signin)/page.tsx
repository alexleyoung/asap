import SignInForm from "@/components/signin/SignInForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className='w-full lg:grid lg:grid-cols-2 h-screen'>
      <SignInForm />
      {/* <Image src="" /> */}
    </main>
  );
}
