"use client";
import React from 'react';
import ReviewDetailsPageLink from '../review/ReviewDetailsPage'
import styleBarModule from './StepBar.module.css';

const StepThree: React.FC = () => (
    <div className={styleBarModule.stepContentDiv}>
        <ReviewDetailsPageLink></ReviewDetailsPageLink>
    </div>
);

export default StepThree;
