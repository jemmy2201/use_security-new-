"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';



const MakePaymentPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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

        </div>
    );
};

export default MakePaymentPage;
