"use client";

import React from 'react';
import { FormProvider } from '../../components/FormContext';
import MyInfoTermsPage from '../../components/myinfoterms/MyInfoTermsPage';

const MyInfoTerms: React.FC = () => {
  return (
    <FormProvider>
      <div>
        <MyInfoTermsPage />
      </div>
    </FormProvider>
  );
};

export default MyInfoTerms;
