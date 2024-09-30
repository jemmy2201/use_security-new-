"use client";

import React, { useState } from 'react';
import SignIn from './signin/page';
import { FormProvider } from './components/FormContext';

const UseHomePage: React.FC = () => {
    return (
        <>
            <FormProvider>
                <SignIn />
            </FormProvider>
        </>
    );
};

export default UseHomePage;