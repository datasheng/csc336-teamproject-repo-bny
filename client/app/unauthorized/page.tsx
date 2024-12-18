'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-4'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-red-600'>Unauthorized Access</h1>
        <p className='text-lg text-gray-600 dark:text-gray-400'>
          You don't have permission to access this page.
        </p>
        <Button onClick={() => router.push('/')} className='mt-4'>
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
