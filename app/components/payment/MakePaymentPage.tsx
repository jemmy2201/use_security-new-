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

    return (

        <form>
            <div className={makePaymentContentstyles.paymentContainer}>
                <div className={makePaymentContentstyles.applicantDetails}>
                    <div className={makePaymentContentstyles.applicantDetailsHeaderCard}>
                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContent}>
                           <h1> Payment Details</h1>
                        </div>

                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                           <h1> All transactions are secure and encrypted.</h1>
                        </div>
                        <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                          <h1>  Please note that there will no cancellations or refunds upon completion of payment.</h1>
                        </div>
                    </div>
                    <div className={makePaymentContentstyles.flexContainer}>
                        <span className={makePaymentContentstyles.paymentContainerAmtHeader}>
                            <div className={makePaymentContentstyles.optionsHeaderText}>
                             <h1>  Amount payable (inclusive of GST)</h1> 
                            </div>

                            <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                                S$22.50
                            </div>
                        </span>
                        <span className={makePaymentContentstyles.paymentContainerAmtHeader}>
                            <div className={makePaymentContentstyles.optionsHeaderText}>
                              <h1> Type of application</h1> 
                            </div>

                            <div className={makePaymentContentstyles.applicantDetailsHeaderCardContentDetail}>
                               <h1> New - Security Officer (SO)</h1>
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
