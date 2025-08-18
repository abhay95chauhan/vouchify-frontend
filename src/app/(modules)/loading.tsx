import { LoaderIcon } from 'lucide-react';
import React from 'react';

const Loading = () => {
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <LoaderIcon className='animate-spin' />
    </div>
  );
};

export default Loading;
