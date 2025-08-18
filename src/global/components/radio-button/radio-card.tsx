import React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}
interface IProps {
  options: Option[];
  value: string;
  onChange: (e: string) => void;
}

const RadioCards = (props: IProps) => {
  return (
    <RadioGroup.Root
      value={props.value}
      defaultValue={props.options[0].value}
      onValueChange={(e) => props.onChange(e)}
      className='w-full grid grid-cols-1 sm:grid-cols-3 gap-4'
    >
      {props.options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            'relative group ring-[1px] ring-border rounded py-2 px-3 text-start',
            'data-[state=checked]:ring-2 data-[state=checked]:ring-primary cursor-pointer'
          )}
        >
          <CircleCheck className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary stroke-white group-data-[state=unchecked]:hidden' />

          {option.icon && (
            <span className='mb-2.5 text-muted-foreground'>{option.icon}</span>
          )}
          <span className='font-semibold tracking-tight'>{option.label}</span>
          <p className='text-xs'>{option.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export default RadioCards;
