"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import CompletePage from '@/components/complete/CompletePage';


const Complete: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <div>
      <CompletePage bookingId={bookingIdString} />
    </div>
  );
};

export default Complete;


