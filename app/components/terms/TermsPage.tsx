"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import termsContentstyles from './TermsContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import stepBarFooterStyle from './StepBarFooter.module.css'

const ReviewDetailsPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [isChecked, setIsChecked] = useState(false);

    // Toggle the checkbox state
    const handleCheckboxToggle = () => {
        setIsChecked(!isChecked);
    };

    const onBack = () => {

    };

    const onNext = () => {
        router.push('/dashboard');
    };


    return (

        <form>
            <div >
                <HeaderPageLink />
            </div>
            <div className={termsContentstyles.paymentContainer}>
                <div className={termsContentstyles.applicantDetails}>
                    <div className={termsContentstyles.applicantDetailsHeaderCard}>
                        <div className={termsContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>  Declaration</h1>
                        </div>
                        <div className={termsContentstyles.optionsHeaderText} onClick={handleCheckboxToggle} style={{ cursor: 'pointer' }}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={isChecked ? "#546E7A" : "white"} stroke="#546E7A" />
                                    {isChecked && (
                                        <path d="M6 12l4 4 8-8" stroke="white" strokeWidth="2" fill="none" />
                                    )}
                                </svg>
                            </span>
                            <span className={termsContentstyles.declareText}>
                                <h1>By checking this box, you acknowledge that you have read and agree to the Union of Security Employees (USE) website’s terms and conditions of use and that the website retains your data only as long as necessary to fulfill the purposes for which it was collected.</h1>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ background: '#F5F6F7' }}>
                <div className={stepBarFooterStyle.buttonBox}>
                    <span className={stepBarFooterStyle.saveDraft}>
                        <button
                            onClick={onBack}
                            style={{ marginRight: '10px' }}
                        >
                            <h1>Cancel</h1>
                        </button>
                    </span>
                    <span className={stepBarFooterStyle.continue}>
                        <div>
                            <button type='button'
                                onClick={onNext}
                            ><h1>
                                    Continue
                                </h1>
                            </button>
                        </div>
                    </span>
                </div>
            </div>
            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default ReviewDetailsPage;
