"use client";

import React from 'react';
import DashBoardPage from '../../components/dashboard/DashBoardPage';
import { FormProvider } from '@/components/FormContext';

const Dashboard: React.FC = () => {

  return (
  
    <FormProvider>
      <DashBoardPage />
    </FormProvider>

  );
};

export default Dashboard;
