// app/dashboard/page.tsx
"use client";

import React from 'react';
import StepBarHomePage from '../components/passcard/StepBarPage';
import { FormProvider } from '../components/FormContext';

const PassCard: React.FC = () => {
  return <div> <FormProvider><StepBarHomePage /> </FormProvider></div>;
};

export default PassCard;
