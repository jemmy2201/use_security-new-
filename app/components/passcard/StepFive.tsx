"use client";
import React from 'react';
import styleBarModule from './StepBar.module.css';
import BookAppointmentPageLink from '../bookappointment/BookAppointmentPage'
import BookAppointmentCompeltePageLink from '../bookappointment/BookAppointmentCompletePage'

import { useFormContext } from '../FormContext';

const StepFive: React.FC = () => {

    const { formData, setFormData } = useFormContext();

    return (
        <div className={styleBarModule.stepContentDiv}>
            {formData.isAppointmentConfirmed ? (
                <BookAppointmentCompeltePageLink />
            ) : (
                <BookAppointmentPageLink />
            )}
        </div>
    );
};

export default StepFive;