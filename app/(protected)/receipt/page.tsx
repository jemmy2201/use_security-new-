"use client";

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import ReceiptPage from '@/components/receipt/ReceiptPage';
import { FormProvider } from '@/components/FormContext';
const SearchParamsWrapperA: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <div>
      <FormProvider>
        <ReceiptPage bookingId={bookingIdString} />
      </FormProvider>
    </div>
  );
};

const Receipt: React.FC = () => {
  return (
    
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapperA />
      </Suspense>
    
  );
};

export default Receipt;





