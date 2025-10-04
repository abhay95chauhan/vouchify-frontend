// 'use client' since this is an interactive component
'use client';

import * as React from 'react';
import {
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  format,
} from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';

export type DateRangePreset = {
  label: string;
  // Allow the preset to compute a range using weekStartsOn if needed
  getRange: (opts?: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) => DateRange;
};

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  presets?: DateRangePreset[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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

function getDefaultPresets(): DateRangePreset[] {
  return [
    {
      label: 'Today',
      getRange: () => {
        const now = new Date();
        return { from: startOfDay(now), to: endOfDay(now) };
      },
    },
    {
      label: 'Yesterday',
      getRange: () => {
        const y = subDays(new Date(), 1);
        return { from: startOfDay(y), to: endOfDay(y) };
      },
    },
    {
      label: 'Last 7 Days',
      getRange: () => {
        const end = endOfDay(new Date());
        const start = startOfDay(subDays(end, 6));
        return { from: start, to: end };
      },
    },
    {
      label: 'Last 30 Days',
      getRange: () => {
        const end = endOfDay(new Date());
        const start = startOfDay(subDays(end, 29));
        return { from: start, to: end };
      },
    },
    {
      label: 'This Week',
      getRange: ({ weekStartsOn = 0 } = {}) => {
        const now = new Date();
        return {
          from: startOfWeek(now, { weekStartsOn }),
          to: endOfWeek(now, { weekStartsOn }),
        };
      },
    },
    {
      label: 'Last Week',
      getRange: ({ weekStartsOn = 0 } = {}) => {
        const thisWeekStart = startOfWeek(new Date(), { weekStartsOn });
        const lastWeekEnd = subDays(thisWeekStart, 1);
        const lastWeekStart = startOfWeek(lastWeekEnd, { weekStartsOn });
        return {
          from: lastWeekStart,
          to: endOfWeek(lastWeekStart, { weekStartsOn }),
        };
      },
    },
    {
      label: 'This Month',
      getRange: () => {
        const now = new Date();
        return { from: startOfMonth(now), to: endOfMonth(now) };
      },
    },
    {
      label: 'Last Month',
      getRange: () => {
        const last = subMonths(new Date(), 1);
        return { from: startOfMonth(last), to: endOfMonth(last) };
      },
    },
    {
      label: 'Year to Date',
      getRange: () => {
        const now = new Date();
        return { from: startOfYear(now), to: endOfDay(now) };
      },
    },
  ];
}

function formatRange(range?: DateRange) {
  if (!range?.from || !range?.to) return '';
  return `${format(range.from, 'PP')} - ${format(range.to, 'PP')}`;
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  presets,
  weekStartsOn = 0,
  placeholder = 'Pick a date range',
  buttonVariant = 'outline',
  className,
  disabled,
  align = 'start',
  side = 'bottom',
  showClear = true,
  label,
  tz,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    value ?? defaultValue
  );

  // Controlled/uncontrolled sync
  React.useEffect(() => {
    if (value !== undefined) {
      setInternal(value);
    }
  }, [value]);

  const resolvedPresets = React.useMemo(
    () => presets ?? getDefaultPresets(),
    [presets]
  );

  const applyRange = (range: DateRange | undefined) => {
    if (value === undefined) {
      setInternal(range);
    }
    onChange?.(range);
  };

  const handleSelect = (range: DateRange | undefined) => {
    applyRange(range);
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    const r = preset.getRange({ weekStartsOn });
    applyRange(r);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    applyRange(undefined);
  };

  const display =
    internal?.from && internal?.to ? formatRange(internal) : placeholder;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label ? <Label>{label}</Label> : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={buttonVariant}
            id='date-range'
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              internal?.from && internal?.to
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            <span className='flex items-center gap-2'>
              <CalendarIcon className='size-4 text-muted-foreground' />
              <span className='truncate'>{display}</span>
            </span>
            {showClear && internal?.from && internal?.to ? (
              <X
                className='size-4 text-muted-foreground'
                aria-label='Clear date range'
                onClick={handleClear}
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 md:w-full'
          align={align}
          side={side}
        >
          <div className='flex flex-col gap-3 p-3 md:flex-row'>
            {/* Presets */}

            <div className='grid grid-cols-2 gap-2 md:flex md:flex-col'>
              {resolvedPresets.map((p) => (
                <Button
                  key={p.label}
                  variant='ghost'
                  className='justify-start'
                  onClick={() => handlePresetClick(p)}
                >
                  {p.label}
                </Button>
              ))}
              {showClear && (
                <Button
                  variant='ghost'
                  className='justify-start'
                  onClick={() => handleClear()}
                >
                  Clear
                </Button>
              )}
            </div>

            <div className='hidden md:block' aria-hidden>
              <div className='h-full w-px bg-border' />
            </div>

            {/* Calendar */}
            <div className='flex-1'>
              <Calendar
                mode='range'
                timeZone={tz}
                selected={internal}
                onSelect={handleSelect}
                // Keep selected start/end connected across months
                numberOfMonths={2}
                weekStartsOn={weekStartsOn}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
