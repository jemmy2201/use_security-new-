"use client";
import React from 'react';
import styleBarModule from './StepBar.module.css';
import PersonalDetailsPageLink from '../personaldetails/PersonalDetailsPage'
const StepOne: React.FC = () => {

    return (
        <div className={styleBarModule.stepContentDiv}>
            <PersonalDetailsPageLink></PersonalDetailsPageLink>
        </div>
    );
};

export default StepOne;
