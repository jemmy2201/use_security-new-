"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type MakePaymentPageProps = {
    onSuccess: () => void; // Callback prop to handle success
};

const MakePaymentPage: React.FC<MakePaymentPageProps> = ({ onSuccess }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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

    return (

        <form>
            <div className={makePaymentContentstyles.paymentContainer}>
                <div className={makePaymentContentstyles.applicantDetails}>
                    <div className={makePaymentContentstyles.applicantDetailsHeaderCard}>
                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContent}>
                            Payment Details
                        </div>

                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                            All transactions are secure and encrypted.
                        </div>
                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Please note that there will no cancellations or refunds upon completion of payment.
                        </div>
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
                    <div>
 
                        {error && <p className={makePaymentContentstyles.error}>{error}</p>}


                    </div>
                </div>
            </div>
        </form>
    );
};

export default MakePaymentPage;
