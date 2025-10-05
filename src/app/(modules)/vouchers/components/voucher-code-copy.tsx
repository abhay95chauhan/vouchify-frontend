import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { Typography } from '@/global/components/typography/typography';
import { cn } from '@/lib/utils';
import React from 'react';

const VoucherCodeCopyComponent = ({ code }: { code: string }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-dashed px-2 py-1 text-sm',
        'border-emerald-400 text-emerald-700 bg-emerald-50'
      )}
      aria-label='Voucher code'
    >
      <Typography.H5 className='cursor-pointer text-green-600 font-mono'>
        {code}
      </Typography.H5>
      <CopyButton
        content={code}
        className='bg-success hover:bg-success/70 no-row-click'
        size='sm'
      />
    </div>
  );
};

export default VoucherCodeCopyComponent;
