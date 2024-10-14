"use client";

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import ReceiptPage from '@/components/receipt/ReceiptPage';

const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return <ReceiptPage bookingId={bookingIdString} />;
};

const Receipt: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};

export default Receipt;

