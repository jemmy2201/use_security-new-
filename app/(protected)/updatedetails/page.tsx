"use client";


import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import UpdateDetailsPage from '@/components/updatedetails/UpdateDetailsPage';
import { FormProvider } from '../../components/FormContext';


const Reschedule: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <FormProvider>
    <div>
      <UpdateDetailsPage bookingId={bookingIdString} />
    </div>
    </FormProvider>
  );
};

export default Reschedule;


