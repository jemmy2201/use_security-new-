"use client";

import React from 'react';
import TermsPage from '../../components/terms/TermsPage';
import { FormProvider } from '@/components/FormContext';

const Terms: React.FC = () => {

  return (

    <FormProvider>
      <TermsPage />
    </FormProvider>

  );


};

export default Terms;
