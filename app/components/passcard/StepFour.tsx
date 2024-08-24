"use client";
import React, { useState, useEffect } from 'react';
import MakePaymentPageLink from '../payment/MakePaymentPage';
import styleBarModule from './StepBar.module.css';
import { useRouter, useSearchParams } from 'next/navigation';

const StepFour: React.FC = () => {
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            // Handle success
            setIsPaymentSuccessful(true);
        }
    }, [searchParams]);

    const handlePaymentSuccess = () => {
        setIsPaymentSuccessful(true);
    };

    return (
        <div className={styleBarModule.stepContentDiv}>
            {isPaymentSuccessful ? (
                <div>
                    <h1>Payment Successful!</h1>
                    <p>Thank you for your purchase. Your payment was successful.</p>
                </div>
            ) : (
                <MakePaymentPageLink onSuccess={handlePaymentSuccess} />
            )}
        </div>
    );
};

export default StepFour;
