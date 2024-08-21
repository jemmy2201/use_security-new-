"use client";
import React from 'react';
import MakePaymentPageLink from '../payment/MakePaymentPage'
import styleBarModule from './StepBar.module.css';

const StepFour: React.FC = () => (
    <div className={styleBarModule.stepContentDiv}>
        <MakePaymentPageLink></MakePaymentPageLink>
    </div>
);

export default StepFour;
