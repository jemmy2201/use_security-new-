"use client";

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import ResubmitPhotoPage from '@/components/resubmitphoto/ResubmitPhoto';
import { FormProvider } from '@/components/FormContext';
const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <FormProvider>
      <ResubmitPhotoPage bookingId={bookingIdString} />
    </FormProvider>
  );
};

const ResubmitPhoto: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};

export default ResubmitPhoto;

