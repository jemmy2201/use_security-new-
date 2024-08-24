"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const MakePaymentPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
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
                await stripe.redirectToCheckout({ sessionId });
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (

        <div className={makePaymentContentstyles.paymentContainer}>
            <div className={makePaymentContentstyles.paymentContainerHeader}>
                <div className={makePaymentContentstyles.paymentContainerHeaderText}>
                    Payment Details
                </div>

                <div className={makePaymentContentstyles.paymentContainerHeaderDetailText}>
                    All transactions are secure and encrypted. Please note that there will no cancellations or refunds upon completion of payment.
                </div>
            </div>
            <div className={makePaymentContentstyles.paymentContainerAmtHeader}>
                <div className={makePaymentContentstyles.paymentContainerAmtHeaderText}>
                    Amount payable (inclusive of GST)
                </div>

                <div className={makePaymentContentstyles.paymentContainerAmtHeaderDetailText}>
                    S$22.50
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
            <div>
                <button onClick={handleCheckout} disabled={loading}>
                    {loading ? 'Processing...' : 'Checkout'}
                </button>
            </div>
        </div>
    );
};

export default MakePaymentPage;
