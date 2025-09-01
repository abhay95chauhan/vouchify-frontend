'use client';

import { Button } from '@/components/ui/button';
import { Typography } from '@/global/components/typography/typography';
import { Plus, Search } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  MainIcon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    btnClick: () => void;
  };
}

export default function DataNotFound({
  MainIcon,
  title,
  description,
  primaryAction,
}: EmptyStateProps) {
  return (
    <div className='container m-auto w-full'>
      <div className='flex flex-col items-center justify-center text-center space-y-4 mb-4 mt-2'>
        {MainIcon}
        <Typography.H3>{title}</Typography.H3>
        <Typography.Muted>{description}</Typography.Muted>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            className='gap-2 bg-transparent'
            onClick={() => window.location.reload()}
          >
            <Search className='h-4 w-4' />
            Refresh
          </Button>
          <Button className='gap-2' onClick={primaryAction?.btnClick}>
            <Plus className='h-4 w-4' />

            {primaryAction?.label}
          </Button>
        </div>
      </div>
    </div>
  );
}
