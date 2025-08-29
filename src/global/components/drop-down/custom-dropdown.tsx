/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Menu {
  label: string;
  labelClass?: string;
  fn: (data?: any) => void;
}
interface IProps<T = any> {
  children: React.ReactNode;
  menu?: Menu[];
  label?: string;
  data?: T;
  position?: 'center' | 'end' | 'start';
}
const CustomDropdown: React.FC<IProps> = (props: IProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
      <DropdownMenuContent align={props.position || 'end'}>
        {props.label && (
          <>
            <DropdownMenuLabel>{props.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {props.menu?.length ? (
          Array.isArray(props.menu) &&
          props.menu?.map((item: Menu, index: number) => {
            return (
              <DropdownMenuItem
                key={index}
                className={item?.labelClass}
                onClick={() => {
                  if (props.data) {
                    item?.fn(props.data);
                  } else {
                    item?.fn();
                  }
                }}
              >
                {item?.label}
              </DropdownMenuItem>
            );
          })
        ) : (
          <Label className='px-4 text-center text-xs'>No Action Found</Label>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
