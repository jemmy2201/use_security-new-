"use client";
import React, { useState, useEffect } from 'react';
import MakePaymentPageLink from '../payment/MakePaymentPage';
import SuccessPaymentPageLink from '../payment/SuccessPaymentPage';
import {} from '../payment/SuccessPaymentPage';
import styleBarModule from './StepBar.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormContext } from '.././FormContext';
import CircularProgress from '@mui/material/CircularProgress';

const StepFour: React.FC = () => {
    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);

    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setLoading(true);
        console.log('inside step 4:');
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            setIsPaymentSuccessful(true);
        }
        setLoading(false);
    }, [searchParams]);

    const handlePaymentSuccess = () => {
        setLoading(true);
        console.log('inside step 4:handlePaymentSuccess');
        setFormData(prevFormData => ({
            ...prevFormData,
            ['paymentProcessed']: true,
            ['paymentSuccess']: true,
        }));
        setIsPaymentSuccessful(true);
        setLoading(false);
    };

    return (
        <div className={styleBarModule.stepContentDiv}>
                        {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}
            {isPaymentSuccessful ? (
                <SuccessPaymentPageLink onSuccess={handlePaymentSuccess} />
            ) : (
                <MakePaymentPageLink onSuccess={handlePaymentSuccess} />
            )}
        </div>
    );
};

export default StepFour;
