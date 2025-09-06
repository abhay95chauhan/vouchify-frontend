'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Typography } from '../typography/typography';
import { redirect } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backRedirectUrl?: string;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  backRedirectUrl,
}: PageHeaderProps) {
  return (
    <div className='flex gap-4 items-center'>
      {showBackButton && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => redirect(backRedirectUrl as string)}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
      )}
      <div className='space-y-2'>
        <Typography.H2>{title}</Typography.H2>
        {description && (
          <Typography.Muted className='font-normal'>
            {description}
          </Typography.Muted>
        )}
      </div>
    </div>
  );
}
