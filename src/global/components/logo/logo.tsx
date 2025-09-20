import { Ticket } from 'lucide-react';
import React from 'react';
import { Typography } from '../typography/typography';

const Logo = () => {
  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <Ticket className='bg-primary text-white group-data-[state=expanded]:w-10 group-data-[state=expanded]:h-10 w-8 h-8 p-2 rounded-sm' />
      <Typography.H4 className='font-bold text-primary font-serif'>
        Vouchify
      </Typography.H4>
    </div>
  );
};

export default Logo;
