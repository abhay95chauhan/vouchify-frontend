'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function EmailTemplateCardSkeleton() {
  return (
    <Card className='rounded-2xl shadow-sm'>
      <CardContent className='p-4 space-y-3'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-6 w-20 rounded-full' />
        </div>

        {/* Subject line */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded-full' />
          <Skeleton className='h-4 w-48' />
        </div>

        {/* Date */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded-full' />
          <Skeleton className='h-4 w-36' />
        </div>

        {/* Email preview box */}
        <Skeleton className='h-24 w-full rounded-md' />

        {/* Preview button */}
        <div className='pt-2'>
          <Button disabled className='w-full rounded-xl' variant='outline'>
            <Eye className='mr-2 h-4 w-4' /> Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
