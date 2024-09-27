"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import { loadStripe } from '@stripe/stripe-js';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useFormContext } from '.././FormContext';

type MakePaymentPageProps = {
    onSuccess: () => void; 
};

const SuccessPaymentPage: React.FC<MakePaymentPageProps> = ({ onSuccess }) => {
    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    return (

        <form>
            <div className={makePaymentContentstyles.mainContainer}>
                <div className={makePaymentContentstyles.stepContentContainer}>

                    <div className={makePaymentContentstyles.headerBox}>

                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <g clipPath="url(#clip0_936_50797)">
                                    <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM33.62 18.18L22.62 33.18C22.26 33.68 21.7 33.98 21.08 34C21.06 34 21.02 34 21 34C20.42 34 19.88 33.76 19.5 33.32L12.5 25.32C11.78 24.48 11.86 23.22 12.68 22.5C13.52 21.78 14.78 21.86 15.5 22.68L20.86 28.8L30.38 15.82C31.04 14.94 32.28 14.74 33.18 15.4C34.08 16.04 34.26 17.3 33.62 18.18Z" fill="#00695C" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_936_50797">
                                        <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <div className={globalStyleCss.header2}>Payment Successful</div>
                    </div>
                    <div className={makePaymentContentstyles.headerBox}>
                        <div className={globalStyleCss.regular}>
                            Thank you for your payment
                        </div>
                    </div>
                    <div className={makePaymentContentstyles.detailSuccessContainer}>
                        <div className={globalStyleCss.header2}>
                            Payment Summary
                        </div>
                        <div className={makePaymentContentstyles.contentBox}>
                            <div className={makePaymentContentstyles.item}>
                                <div className={globalStyleCss.regularBold}>Amount paid (inclusive of GST) </div>
                                <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>S${formData.grandTotal}</div></div>
                            </div>
                            <div className={makePaymentContentstyles.item}>
                                <div className={globalStyleCss.regularBold}>Transaction reference no. </div>
                                <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.transactionReference}</div></div>
                            </div>
                        </div>
                        <div className={makePaymentContentstyles.contentBox}>
                            <div className={makePaymentContentstyles.item}>
                                <div className={globalStyleCss.regularBold}>Type of application </div>
                                <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.cardId == '1' ? 'Security Officer (SO)/Aviation Security Officer (AVSO)' : 'Private Investigator (PI)'}</div></div>
                            </div>

                        </div>
                    </div>
                </div>



            </div>



        </form >
    );
};

export default SuccessPaymentPage;
