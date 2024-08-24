"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { loadStripe } from '@stripe/stripe-js';


type MakePaymentPageProps = {
    onSuccess: () => void; // Callback prop to handle success
};

const SuccessPaymentPage: React.FC<MakePaymentPageProps> = ({ onSuccess }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    return (

        <div className={makePaymentContentstyles.paymentContainer}>
            <div className={makePaymentContentstyles.paymentContainerHeader}>
                <div className={makePaymentContentstyles.paymentContainerHeaderText}>
                    Payment Summary
                </div>
            </div>
            <div className={makePaymentContentstyles.paymentContainerAmtHeader}>
                <div className={makePaymentContentstyles.paymentContainerAmtHeaderText}>
                    Amount paid (inclusive of GST)
                </div>

                <div className={makePaymentContentstyles.paymentContainerAmtHeaderDetailText}>
                    S$22.50
                </div>
            </div>
            <div className={makePaymentContentstyles.paymentContainerAmtHeader}>
                <div className={makePaymentContentstyles.paymentContainerAmtHeaderText}>
                    Transaction reference no.
                </div>

                <div className={makePaymentContentstyles.paymentContainerAmtHeaderDetailText}>
                    XXXXXXXXX
                </div>
            </div>
            <div className={makePaymentContentstyles.paymentContainerAmtHeader}>
                <div className={makePaymentContentstyles.paymentContainerAmtHeaderText}>
                    Type of application
                </div>

                <div className={makePaymentContentstyles.paymentContainerAmtHeaderDetailText}>
                    New - Security Officer (SO)
                </div>
            </div>

        </div>
    );
};

export default SuccessPaymentPage;
