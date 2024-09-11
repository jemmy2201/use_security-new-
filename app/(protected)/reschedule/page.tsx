"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import ReschedulePage from '@/components/reschedule/ReschedulePage';


const Reschedule: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <div>
      <ReschedulePage bookingId={bookingIdString} />
    </div>
  );
};

export default Reschedule;


