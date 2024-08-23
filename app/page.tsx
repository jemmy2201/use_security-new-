"use client";

import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import { FormProvider } from './components/FormContext';

const UseHomePage: React.FC = () => {
    return (
        <div>
            <FormProvider>
            <HomePage /> 
            </FormProvider>
        </div>
    );
};

export default UseHomePage;