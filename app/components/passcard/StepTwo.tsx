"use client";
import React from 'react';
import ApplicantDetailsPageLink from '../applicantdetails/ApplicantDetailsPage'
import styleBarModule from './StepBar.module.css';

const StepTwo: React.FC = () => (
    <div className={styleBarModule.stepContentDiv}>
        <ApplicantDetailsPageLink></ApplicantDetailsPageLink>
    </div>
);

export default StepTwo;
