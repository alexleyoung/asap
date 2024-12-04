"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex w-[100px] items-center justify-start text-sm font-medium'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}>
          <DoubleArrowLeftIcon className='h-4 w-4' />
          <span className='sr-only'>First page</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}>
          <ChevronLeftIcon className='h-4 w-4' />
          <span className='sr-only'>Previous page</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}>
          <ChevronRightIcon className='h-4 w-4' />
          <span className='sr-only'>Next page</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}>
          <DoubleArrowRightIcon className='h-4 w-4' />
          <span className='sr-only'>Last page</span>
        </Button>
      </div>
      <div className='w-[100px]' />
    </div>
  );
}
