"use client";

import React, { useState } from 'react';
import StepBar from './StepBar';
import Header from '../Header'; 
import Footer from './Footer'; 

// Import the step components
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';


// Define the steps array with imported components and labels
const steps = [
    { content: <StepOne />, label: '1 Personal Details' },
    { content: <StepTwo />, label: '2 Application Details' },
    { content: <StepThree />, label: '3 Review Photo' },
    { content: <StepFour />, label: '4 Make Payment' },
    { content: <StepFive />, label: '5 Book Appointment' },
];

const StepBarHomePage: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prevStep => prevStep + 1);
        }
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
            <Header /> {/* Include the Header component */}
            <main style={{ padding: '20px', minHeight: '70vh' }}>
                <StepBar steps={steps} activeStep={activeStep} />
            </main>
            <Footer 
                onNext={handleNext}
                onBack={handleBack}
                onSaveDraft={handleSaveDraft}
                hasNext={activeStep < steps.length - 1}
                hasBack={activeStep > 0}
            /> {/* Include the Footer component with navigation handlers */}
        </div>
    );
};

export default StepBarHomePage;
