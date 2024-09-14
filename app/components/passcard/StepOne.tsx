"use client";
import React from 'react';
import styleBarModule from './StepBar.module.css';
import PersonalDetailsPageLink from '../personaldetails/PersonalDetailsPage'
const StepOne: React.FC = () => {

    return (
        <div>
            <PersonalDetailsPageLink></PersonalDetailsPageLink>
        </div>
    );
};

export default StepOne;
