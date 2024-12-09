import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';

interface DroppableTimeSlotProps {
  date: Date;
  children?: React.ReactNode;
  className?: string;
}

export default function DroppableTimeSlot({
  date,
  children,
  className = '',
}: DroppableTimeSlotProps) {
  // Format: dropzone-2024-01-09-14-30 (year-month-day-hour-minute)
  const dropId = `dropzone-${format(date, 'yyyy-MM-dd-HH-mm')}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: { date },
  });

  return (
    <div
      ref={setNodeRef}
      data-date={format(date, 'HH:mm')}
      className={`${className} ${
        isOver ? 'bg-accent/20' : ''
      } transition-colors duration-200`}
    >
      {children}
    </div>
  );
}
