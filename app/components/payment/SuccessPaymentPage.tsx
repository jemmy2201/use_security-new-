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

        <form>
            <div className={makePaymentContentstyles.paymentContainer}>
                <div className={makePaymentContentstyles.applicantDetails}>
                    <div className={makePaymentContentstyles.applicantDetailsHeaderCard}>
                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContent}>
                            Payment Successful
                        </div>

                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Thank you for your payment
                        </div>
                    </div>
                    <div className={makePaymentContentstyles.applicantDetailsHeaderCardContent}>
                        Payment Summary
                    </div>
                    <div className={makePaymentContentstyles.flexContainer}>
                        <span className={makePaymentContentstyles.paymentContainerAmtHeader}>
                            <div className={makePaymentContentstyles.optionsHeaderText}>
                                Amount payable (inclusive of GST)
                            </div>

                            <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                                S$22.50
                            </div>
                        </span>
                        <span className={makePaymentContentstyles.paymentContainerAmtHeader}>
                            <div className={makePaymentContentstyles.optionsHeaderText}>
                                Type of application
                            </div>

                            <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                                New - Security Officer (SO)
                            </div>
                        </span>
                    </div>
                    <div className={makePaymentContentstyles.flexContainer}>
                        <span className={makePaymentContentstyles.paymentContainerAmtHeader}>
                            <div className={makePaymentContentstyles.optionsHeaderText}>
                                Transaction Reference Number
                            </div>
                            <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                                XXXXX
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SuccessPaymentPage;
