"use client";

import React from 'react';
import ContactusPage from '@/components/contactuslogin/page';
import { FormProvider } from '@/components/FormContext';
const ContactusLogin: React.FC = () => {
  return (
    <FormProvider>
      <ContactusPage />
    </FormProvider>
  );
};

export default ContactusLogin;
