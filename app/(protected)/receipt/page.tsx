"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import ReceiptPage from '@/components/receipt/ReceiptPage';


const Complete: React.FC = () => {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const bookingIdString = typeof bookingId === 'string' ? bookingId : '';

  return (
    <div>
      <ReceiptPage bookingId={bookingIdString} />
    </div>
  );
};

export default Complete;


