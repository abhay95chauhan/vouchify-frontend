'use client';

import { Button } from '@/components/ui/button';
import { Server, RefreshCw, AlertTriangle, Clock, Wifi } from 'lucide-react';

interface ServerDownProps {
  onRetry?: () => void;
  message?: string;
}

export default function ServerDown({
  onRetry,
  message = 'Our servers are currently experiencing issues. Please try again in a few moments.',
}: ServerDownProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4'>
      <div className='max-w-lg w-full text-center'>
        <div className='relative mb-12'>
          <div className='w-32 h-32 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse'>
            <Server className='w-16 h-16 text-red-600' />
          </div>
          <div className='absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce'>
            <AlertTriangle className='w-5 h-5 text-white' />
          </div>
          <div className='absolute -top-8 -left-8 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-ping'></div>
          <div className='absolute -bottom-4 -right-8 w-6 h-6 bg-indigo-200 rounded-full opacity-40 animate-pulse'></div>
        </div>

        <div className='bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-white/20'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4'>
            Server Temporarily Down
          </h1>
          <p className='text-gray-600 mb-8 leading-relaxed text-lg'>
            {message}
          </p>

          <div className='flex justify-center gap-6 mb-10'>
            <div className='flex items-center gap-2 text-sm bg-red-50 px-4 py-2 rounded-full'>
              <div className='w-3 h-3 bg-red-500 rounded-full animate-pulse'></div>
              <span className='text-red-700 font-medium'>Service Down</span>
            </div>
            <div className='flex items-center gap-2 text-sm bg-amber-50 px-4 py-2 rounded-full'>
              <Clock className='w-3 h-3 text-amber-600' />
              <span className='text-amber-700 font-medium'>ETA: 5-10 min</span>
            </div>
          </div>

          {onRetry && (
            <Button onClick={onRetry} className='w-full py-6 px-4 text-lg'>
              <RefreshCw className='w-8 h-8' />
              Try Again
            </Button>
          )}
        </div>

        <div className='mt-8 space-y-2'>
          <p className='text-sm text-gray-500'>
            If the problem persists, please contact our support team.
          </p>
          <div className='flex items-center justify-center gap-2 text-xs text-gray-400'>
            <Wifi className='w-3 h-3' />
            <span>Check your internet connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
