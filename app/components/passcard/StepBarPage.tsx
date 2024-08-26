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
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            // Handle success
            setFormData(prevFormData => ({
                ...prevFormData,
                ['paymentProcessed']: true,
                ['paymentSuccess']: true,
            }));
            setIsPaymentSuccessful(true);
            setActiveStep(3);
        }
    }, [searchParams]);

    const handlePaymentSuccess = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            ['paymentProcessed']: true,
            ['paymentSuccess']: true,
        }));
        setIsPaymentSuccessful(true);
    };

    const handleNext = () => {

        if (activeStep == 3 && !formData.paymentProcessed) {
            handleCheckout();
        } else {
            if (formData.originalMobileno === formData.mobileno 
                || (formData.isOtpVerified && formData.mobileno==formData.verifiedMobileNo)) {
                console.log('same mobile');
                setIsOtpPopupOpen(false);
                if (activeStep < steps.length - 1) {
                    setActiveStep(prevStep => prevStep + 1);
                }
            } else {
                console.log('mobile changed');
                setIsOtpPopupOpen(true);
            }
        }

    };


    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            if (stripe) {
                // Redirect to Stripe Checkout
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (!error) {
                    // Optionally, handle success callback if needed after redirection
                } else {
                    console.error('Stripe error:', error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing the payment.');
        }
        setLoading(false);
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevStep => prevStep - 1);
        }
    };

    const handleSaveDraft = () => {
        console.log("Draft saved!");
    };


    const handleOtpCancel = () => {
        setIsOtpPopupOpen(false); // Close OTP popup if user cancels
    };

    return (
        <div>
            <HeaderPageLink></HeaderPageLink>
            <main style={{ padding: '20px', minHeight: '70vh', background: '#F5F6F7' }}>
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
            />
        </div>
    );
};

export default StepBarHomePage;
