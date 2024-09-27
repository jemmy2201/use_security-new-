"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { loadStripe } from '@stripe/stripe-js';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useFormContext } from '.././FormContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type MakePaymentPageProps = {
    onSuccess: () => void; 
};

const MakePaymentPage: React.FC<MakePaymentPageProps> = ({ onSuccess }) => {

    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    return (

        <form>
            <div className={makePaymentContentstyles.mainContainer}>
                <div className={makePaymentContentstyles.stepContentContainer}>
                    <div className={globalStyleCss.header2}>
                        Payment Details
                    </div>

                    <div className={globalStyleCss.regular}>
                        All transactions are secure and encrypted.
                    </div>
                    <div className={makePaymentContentstyles.warningContainer}>
                        <div className={makePaymentContentstyles.warningBox}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_1358_8597)">
                                    <path fillRule="evenodd" clip-rule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1358_8597">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={globalStyleCss.regular}> &nbsp;Please note that there will no cancellations or refunds upon completion of payment.</div>
                        </div>

                    </div>

                    <div className={makePaymentContentstyles.contentBox}>
                        <div className={makePaymentContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Amount payable (inclusive of GST) </div>
                            <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>S${formData.grandTotal}</div></div>

                        </div>
                        <div className={makePaymentContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Type of application </div>
                            <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.cardId == '1' ? 'Security Officer (SO)/Aviation Security Officer (AVSO)' : 'Private Investigator (PI)'}</div></div>
                        </div>
                    </div>
                </div>
                {error && <p className={makePaymentContentstyles.error}>{error}</p>}

            </div>
        </form>
    );
};

export default MakePaymentPage;
