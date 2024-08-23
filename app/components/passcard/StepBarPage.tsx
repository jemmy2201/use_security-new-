"use client";

import React, { useEffect, useState } from 'react';
import StepBar from './StepBar';
import Footer from './Footer';

// Import the step components
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import OtpPopup from './OtpPopup';

import FooterPageLink from '../footer/FooterPage'
import HeaderPageLink from '../header/HeaderPage'
import { useFormContext } from '.././FormContext';
import stepBarModuleStyle from './StepBar.module.css';

// Define the steps array with imported components and labels
const steps = [
    { content: <StepOne />, label: '1 Personal Details' },
    { content: <StepTwo />, label: '2 Application Details' },
    { content: <StepThree />, label: '3 Review Details' },
    { content: <StepFour />, label: '4 Make Payment' },
    { content: <StepFive />, label: '5 Book Appointment' },
];

const StepBarHomePage: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const { formData, setFormData } = useFormContext();
    const [isOtpPopupOpen, setIsOtpPopupOpen] = useState<boolean>(false); // State for OTP popup
    const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

    const handleNext = () => {

        if (formData.originalMobileno === formData.mobileno || isOtpVerified) {
            console.log('same mobile');
            if (activeStep < steps.length - 1) {
                setActiveStep(prevStep => prevStep + 1);
            }
        } else {
            console.log('mobile changed');
            setIsOtpPopupOpen(true); // Open OTP popup when the mobile number changes
        }
    };

    const handleOtpSubmit = () => {
        // Logic to handle OTP submission
        setIsOtpPopupOpen(false);
        setIsOtpVerified(true); // Close OTP popup after OTP is verified
    };

    const handleOtpCancel = () => {
        setIsOtpPopupOpen(false); // Close OTP popup if user cancels
    };
    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevStep => prevStep - 1);
        }
    };

    const handleSaveDraft = () => {
        console.log("Draft saved!");
    };

    return (
        <div>
            <HeaderPageLink></HeaderPageLink>
            <main style={{ padding: '20px', minHeight: '70vh' }}>
                <StepBar steps={steps} activeStep={activeStep} />
            </main>
            <Footer
                onNext={handleNext}
                onBack={handleBack}
                onSaveDraft={handleSaveDraft}
                hasNext={activeStep < steps.length - 1}
                hasBack={activeStep > 0}
                activeStep={activeStep}
            />
            <FooterPageLink></FooterPageLink>
            <OtpPopup
                isOpen={isOtpPopupOpen}
                onClose={handleOtpCancel}
                onSubmit={handleOtpSubmit}
            />
        </div>
    );
};

export default StepBarHomePage;
