'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/global/components/typography/typography';
import { errorMessages } from '@/global/utils/error-message';
import { Plus, Search, Ticket } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

export default function VoucherNotFound() {
  return (
    <div className='container m-auto w-full'>
      <div className='flex flex-col items-center justify-center text-center space-y-4 mb-4 mt-2'>
        <Ticket className='text-primary' size={150} />
        <Typography.H3>{errorMessages.voucher.notFound.title}</Typography.H3>
        <Typography.Muted>
          {errorMessages.voucher.notFound.desc}
        </Typography.Muted>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='gap-2 bg-transparent'
            onClick={() => window.location.reload()}
          >
            <Search className='h-4 w-4' />
            Refresh
          </Button>
          <Button
            className='gap-2'
            onClick={() => redirect('/vouchers/create')}
          >
            <Plus className='h-4 w-4' />
            {errorMessages.voucher.notFound.btnLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
