"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import UpdateDetailsPage from '@/components/updatedetails/UpdateDetailsPage';
import { FormProvider } from '../../components/FormContext';

const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return <UpdateDetailsPage bookingId={bookingIdString} />;
};

const UpdatePage: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};


export default UpdatePage;



