"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import StepBarHomePage from '../components/passcard/StepBarPage';
import { FormProvider } from '../components/FormContext';

const SearchParamsWrapper: React.FC = () => {
  const searchParams = useSearchParams()
  const actionType = searchParams.get('actionType')
  const actionTypeString = typeof actionType === 'string' ? actionType : '';

  return (

    <FormProvider>
      <StepBarHomePage actionType={actionTypeString} />
    </FormProvider>

  );
};


const PassCard: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
    </div>
  );
};


export default PassCard;


