"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useFormContext } from '.././FormContext';


type MakePaymentPageProps = {
    onSuccess: () => void; 
};

const MakePaymentPage: React.FC<MakePaymentPageProps> = ({ onSuccess }) => {

    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('paynow');
    const router = useRouter();
    
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            paymentMethod: paymentMethod,
        }));
    }, [paymentMethod, setFormData]);
    
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPaymentMethod(value);
    };

    // Calculate display amount based on payment method
    const displayAmount = paymentMethod === 'card'
        ? (parseFloat(formData.grandTotal ?? '0') + 1.40).toFixed(2)
        : formData.grandTotal ?? '0';

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
                                    <path fillRule="evenodd" clipRule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1358_8597">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={globalStyleCss.regular}> &nbsp;Please note that there will be no cancellation or refunds upon completion of payment</div>
                        </div>
                    </div>

                    {/* Show additional charge banner if payment method is card */}
                    {paymentMethod === 'card' && (
                        <div className={makePaymentContentstyles.warningContainer}>
                            <div className={makePaymentContentstyles.warningBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1358_8597)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1358_8597">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div className={globalStyleCss.regular}>&nbsp;There will be additional charge of 1.40 SGD for Credit Card payment.</div>
                            </div>
                        </div>
                    )}

                    <div className={makePaymentContentstyles.contentBox}>
                        <div className={makePaymentContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Amount payable (inclusive of GST) </div>
                            <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>S${displayAmount}</div></div>

                        </div>
                        <div className={makePaymentContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Type of application </div>
                            <div className={makePaymentContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.cardId == '1' ? 'Security Officer (SO) / Aviation Security Officer (AVSO)' : 'Private Investigator (PI)'}</div></div>
                        </div>
                    </div>
                    <div className={makePaymentContentstyles.contentBox}>    
                        <div className={makePaymentContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Payment Method</div>
                            <div className={makePaymentContentstyles.inputText}>
                                <div className={globalStyleCss.regular}>
                                    <div className={makePaymentContentstyles.paymentOption}>
                                        <input
                                            type="radio"
                                            id="paynow"
                                            name="paymentMethod"
                                            value="paynow"
                                            checked={paymentMethod === 'paynow'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        <label htmlFor="paynow" className={globalStyleCss.regular}>PayNow</label>
                                    </div>

                                    <div className={makePaymentContentstyles.paymentOption}>
                                        <input
                                            type="radio"
                                            id="card"
                                            name="paymentMethod"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                        <label htmlFor="card" className={globalStyleCss.regular}>Credit Card</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {error && <p className={makePaymentContentstyles.error}>{error}</p>}

            </div>
        </form>
    );
};

export default MakePaymentPage;
