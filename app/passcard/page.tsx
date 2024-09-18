// app/dashboard/page.tsx
"use client";

import React from 'react';
import {useSearchParams } from 'next/navigation';

import StepBarHomePage from '../components/passcard/StepBarPage';
import { FormProvider } from '../components/FormContext';



const PassCard: React.FC = () => {
  const searchParams = useSearchParams()
  const actionType = searchParams.get('actionType')
  const actionTypeString = typeof actionType === 'string' ? actionType : '';
  return (
    <div>
      <FormProvider>
        <StepBarHomePage actionType={actionTypeString} />
      </FormProvider>
    </div>
  );
};

export default PassCard;
