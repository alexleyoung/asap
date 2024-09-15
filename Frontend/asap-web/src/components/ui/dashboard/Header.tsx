import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className='px-5 py-3 border-b border-border flex items-center justify-between'>
      <h1 className='text-2xl font-bold'>asap.</h1>
      <div className='flex gap-4 items-center'>
        <Avatar className='hover:cursor-pointer relative group'>
          <div className='absolute size-12 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-all' />
          <AvatarImage
            src='https://github.com/alexleyoung.png'
            alt='@alexleyoung'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
