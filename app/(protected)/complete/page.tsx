"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import CompletePage from '@/components/complete/CompletePage';

const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';
  const reschedule = searchParams.get('reschedule')
  const rescheduleString = typeof reschedule === 'string' ? reschedule : '';

  return <CompletePage bookingId={bookingIdString} reschedule={rescheduleString} />;
};

const Complete: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};


export default Complete;


