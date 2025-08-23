import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import React from 'react';

const VoucherCreate = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div className='space-y-4'>
          <Typography.H2>Create New Voucher</Typography.H2>
          <Typography.Muted className='font-normal'>
            Design and configure your new promotional voucher.
          </Typography.Muted>
        </div>
      </div>
      <CardComponent
        title={
          <div className='space-y-2'>
            <Typography.H4>Voucher Details</Typography.H4>
            <Typography.Muted className='font-normal'>
              Basic information about your voucher.
            </Typography.Muted>
          </div>
        }
      >
        helo
      </CardComponent>
    </div>
  );
};

export default VoucherCreate;
