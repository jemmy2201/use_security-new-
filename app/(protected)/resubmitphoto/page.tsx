"use client";

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import ResubmitPhotoPage from '@/components/resubmitphoto/ResubmitPhoto';

const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return <ResubmitPhotoPage bookingId={bookingIdString} />;
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

