"use client";
import React, { useState, useEffect } from 'react';
import MakePaymentPageLink from '../payment/MakePaymentPage';
import SuccessPaymentPageLink from '../payment/SuccessPaymentPage';
import {} from '../payment/SuccessPaymentPage';
import styleBarModule from './StepBar.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormContext } from '.././FormContext';

const StepFour: React.FC = () => {
    const { formData, setFormData } = useFormContext();

    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        console.log('inside step 4:');
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            setIsPaymentSuccessful(true);
        }
    }, [searchParams]);

    const handlePaymentSuccess = () => {
        console.log('inside step 4:handlePaymentSuccess');
        setFormData(prevFormData => ({
            ...prevFormData,
            ['paymentProcessed']: true,
            ['paymentSuccess']: true,
        }));
        setIsPaymentSuccessful(true);
    };

    return (
        <div className={styleBarModule.stepContentDiv}>
            {isPaymentSuccessful ? (
                <SuccessPaymentPageLink onSuccess={handlePaymentSuccess} />
            ) : (
                <MakePaymentPageLink onSuccess={handlePaymentSuccess} />
            )}
        </div>
    );
};

export default StepFour;
