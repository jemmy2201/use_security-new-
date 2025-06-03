"use client";

import React from 'react';
import FirstTimePage from '@/components/firsttime/FirstTimePage';
import { FormProvider } from '@/components/FormContext';
const FirstTime: React.FC = () => {
  return (
    <FormProvider>
      <FirstTimePage />
    </FormProvider>
  );
};

export default FirstTime;
