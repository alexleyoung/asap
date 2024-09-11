import React from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);

  return (
    <div className='bg-background text-foreground flex flex-col h-full overflow-hidden'>
      <div className='absolute z-50 -top-1 min-w-fit gap-8 flex justify-between items-center p-4'>
        <div className='flex gap-4 items-center'>
          <Skeleton className='size-8' />
          <Skeleton className='size-8' />
          <Skeleton className='h-8 w-40' />
        </div>
        <Skeleton className='h-8 w-24' />
      </div>
      <div className='flex py-2 border-b bg-background sticky top-0 z-20'>
        <div className='w-16 flex-shrink-0' />
        {Array.from({ length: 7 }).map((_, index) => {
          const day = addDays(startOfCurrentWeek, index);
          return (
            <div
              key={index}
              className='flex-1 text-center border-l first:border-l-0 py-2'>
              <div className='text-md font-semibold'>
                {format(day, "EEE d")}
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex-grow overflow-hidden'>
        <div className='flex relative h-[1440px]'>
          <div className='w-16 border-r flex-shrink-0'></div>
          <div className='flex-1 flex'>
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={dayIndex}
                className='flex-1 border-l border-border'></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
