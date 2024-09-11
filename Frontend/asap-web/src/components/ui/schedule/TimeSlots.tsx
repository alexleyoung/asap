import { formatHour } from "@/lib/utils";

type TimeSlotsProps = {
  startHour: number;
  endHour: number;
  onTimeClick: (day: Date, hour: number) => void;
};

export function TimeSlots({ startHour, endHour, onTimeClick }: TimeSlotsProps) {
  return (
    <>
      {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
        const hour = startHour + i;
        return (
          <div key={hour} className='relative h-[60px]'>
            <span
              className='absolute right-2 text-xs text-muted-foreground cursor-pointer select-none'
              onClick={(e) => {
                e.preventDefault();
                onTimeClick(new Date(), hour);
              }}>
              {formatHour(hour)}
            </span>
          </div>
        );
      })}
    </>
  );
}
