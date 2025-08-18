'use client';

import { Ticket } from 'lucide-react';
import React from 'react';
import { Typography } from '../typography/typography';
import { useIsMobile } from '@/hooks/use-mobile';

const LogoSidebar = () => {
  const isMobile = useIsMobile();
  return (
    <div className='flex items-center gap-3 cursor-pointer'>
      <Ticket className='bg-primary text-white group-data-[state=expanded]:w-10 group-data-[state=expanded]:h-10 w-8 h-8 p-2 rounded-sm' />
      <Typography.H4 className='hidden group-data-[state=expanded]:block font-bold text-primary'>
        Vouchify
      </Typography.H4>
      {isMobile && (
        <Typography.H4 className='block group-data-[state=expanded]:hidden font-bold text-primary'>
          Vouchify
        </Typography.H4>
      )}
    </div>
  );
};

export default LogoSidebar;
