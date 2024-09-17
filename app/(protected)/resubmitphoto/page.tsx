"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import ResubmitPhotoPage from '@/components/resubmitphoto/ResubmitPhoto';


const Reschedule: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <div>
      <ResubmitPhotoPage bookingId={bookingIdString} />
    </div>
  );
};

export default Reschedule;


