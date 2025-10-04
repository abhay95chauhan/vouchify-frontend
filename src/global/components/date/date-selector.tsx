'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export type DatePickerProps = {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  className?: string;
  disabled?: boolean;
  align?: React.ComponentProps<typeof PopoverContent>['align'];
  side?: React.ComponentProps<typeof PopoverContent>['side'];
  showClear?: boolean;
  label?: string;
  tz?: string;
};

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  buttonVariant = 'outline',
  className,
  disabled,
  align = 'start',
  side = 'bottom',
  showClear = true,
  label,
  tz,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<Date | undefined>(
    value ?? defaultValue
  );

  // Controlled/uncontrolled sync
  React.useEffect(() => {
    if (value !== undefined) {
      setInternal(value);
    }
  }, [value]);

  const applyDate = (date: Date | undefined) => {
    if (value === undefined) {
      setInternal(date);
    }
    onChange?.(date);
  };

  const handleSelect = (date: Date | undefined) => {
    applyDate(date);
    // close after selecting a date
    if (date) setOpen(false);
  };

  const display =
    internal && internal instanceof Date && !isNaN(internal.getTime())
      ? format(internal, 'PP')
      : placeholder;

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className='mb-2 text-sm font-medium text-foreground'>{label}</div>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={buttonVariant}
            id='date-picker'
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              internal ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <span className='flex items-center gap-2'>
              <CalendarIcon className='size-4 text-muted-foreground' />
              <span className='truncate'>{display}</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align={align} side={side}>
          <Calendar
            timeZone={tz}
            mode='single'
            selected={internal}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
