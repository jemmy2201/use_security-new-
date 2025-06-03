"use client";

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import ReschedulePage from '@/components/reschedule/ReschedulePage';
import { FormProvider } from '@/components/FormContext';
const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <FormProvider>
      <ReschedulePage bookingId={bookingIdString} />
    </FormProvider>
  );
};

const Reschedule: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};

export default Reschedule;
