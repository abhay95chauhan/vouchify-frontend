import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface IProps {
  min?: string;
  max?: string;
  placeholder?: string;
  btnisabled?: boolean;
  selected: string;
  onSelect: (date: string) => void;
  disabled?: (date: Date) => boolean; // Function to determine disabled dates
}

export function DateSelector(props: Readonly<IProps>) {
  const [date, setDate] = useState<Date | null>(
    props.selected ? moment(props.selected, 'YYYY-MM-DD').toDate() : null
  );

  useEffect(() => {
    setDate(
      props.selected ? moment(props.selected, 'YYYY-MM-DD').toDate() : null
    );
  }, [props.selected]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={props.btnisabled}
          variant='outline'
          className={cn(
            'pl-3 text-left font-normal w-full',
            !date && 'text-muted-foreground'
          )}
        >
          {date ? (
            moment(date).format('ll')
          ) : (
            <span>{props.placeholder || 'Pick a date'} </span>
          )}
          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          className='pointer-events-auto'
          mode={'single'}
          selected={date as Date}
          onSelect={(selectedDate: Date | undefined) => {
            if (selectedDate) {
              const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
              setDate(moment(formattedDate, 'YYYY-MM-DD').toDate()); // Ensures consistency
              props.onSelect(formattedDate);
            }
          }}
          //   disabled={props.disabled}
          disabled={{
            before: moment(props.min, 'YYYY-MM-DD').toDate(),
            after: moment(props.max, 'YYYY-MM-DD').toDate(),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
