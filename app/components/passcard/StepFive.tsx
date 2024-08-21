"use client";
import React from 'react';
import styleBarModule from './StepBar.module.css';
import BookAppointmentPageLink from '../bookappointment/BookAppointmentPage'

const StepFive: React.FC = () => (
    <div className={styleBarModule.stepContentDiv}>
        <BookAppointmentPageLink></BookAppointmentPageLink>
    </div>
);

export default StepFive;
