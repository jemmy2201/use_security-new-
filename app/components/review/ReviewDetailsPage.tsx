"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import reviewDetailsContentstyles from './ReviewDetailsContent.module.css';
import { useFormContext } from '.././FormContext';

const ReviewDetailsPage: React.FC = () => {

    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [isChecked, setIsChecked] = useState(false);

    // Toggle the checkbox state
    const handleCheckboxToggle = () => {
        setIsChecked(!isChecked);
        setFormData(prevFormData => ({
            ...prevFormData,
            ['isTermsAndConditionSigned']: !isChecked,
        }));
    };

    useEffect(() => {
        // Set the selected option from formData if available
        if (formData.applicationType) {
            setIsChecked(formData?.isTermsAndConditionSigned || false);
        }
    }, [formData]);

    return (

            <form>
                <div className={reviewDetailsContentstyles.paymentContainer}>
                    <div className={reviewDetailsContentstyles.applicantDetails}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Personal Details
                            </div>
                        </div>
                        <div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                Full name
                            </div>
                            <div>
                                {formData.name}
                            </div>
                        </div>
                        <div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                NRIC / FIN No.
                            </div>
                            <div>
                                {formData.nric}
                            </div>
                        </div>
                        <div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                Mobile number
                            </div>
                            <div>
                                {formData.mobileno}
                            </div>
                        </div>
                        <div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                Email address
                            </div>
                            <div>
                                {formData.email}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={reviewDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={reviewDetailsContentstyles.paymentContainer}>

                    <div className={reviewDetailsContentstyles.applicantDetails}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Applicant Details
                            </div>
                            <div className={reviewDetailsContentstyles.options}>
                                <div className={reviewDetailsContentstyles.optionsHeader}>
                                    <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                        Type of application
                                    </div>
                                    <div>
                                        {formData.applicationType == "SO" ? <div>Security Officer (SO)</div> : ""}
                                        {formData.applicationType == "AVSO" ? <div>Aviation Security Officer (AVSO)</div> : ""}
                                        {formData.applicationType == "PI" ? <div>Private Investigator (PI)</div> : ""}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={reviewDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={reviewDetailsContentstyles.paymentContainer}>

                    <div className={reviewDetailsContentstyles.applicantDetails}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Photo
                            </div>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                Please make sure your photo meets our photo guidelines to prevent your application from being rejected.                        </div>
                            <img src={formData.image} alt="Processed" />
                        </div>
                    </div>
                </div>
                <div className={reviewDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={reviewDetailsContentstyles.paymentContainer}>
                    <div className={reviewDetailsContentstyles.applicantDetails}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Training records
                            </div>

                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                Types of trainings
                            </div>
                            {formData.trAvso ? <div>Airport Screener Deployment</div> : ""}
                            {formData.trCctc ? <div>Conduct Crowd and Traffic Control (CCTC)</div> : ""}
                            {formData.trCsspb ? <div>Conduct Security Screening of Person and Bag (CSSPB)</div> : ""}
                            {formData.trNota ? <div>None of the above (SO)</div> : ""}
                            {formData.trHcta ? <div>Handle Counter Terrorist Activities (HCTA)</div> : ""}
                            {formData.trXray ? <div>Conduct Screening using X-ray Machine (X-RAY)</div> : ""}
                            {formData.trObsa ? <div>Operate Basic Security Equipment</div> : ""}
                            {formData.trSsm ? <div>Security Surveillance Management</div> : ""}
                            {formData.trRtt ? <div>Recognise Terrorist Threat (RTT)</div> : ""}
                        </div>
                    </div>
                </div>
                <div className={reviewDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={reviewDetailsContentstyles.paymentContainer}>
                    <div className={reviewDetailsContentstyles.applicantDetails}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Declaration
                            </div>

                            <div className={reviewDetailsContentstyles.optionsHeaderText} onClick={handleCheckboxToggle} style={{ cursor: 'pointer' }}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={isChecked ? "#546E7A" : "white"} stroke="#546E7A" />
                                        {isChecked && (
                                            <path d="M6 12l4 4 8-8" stroke="white" strokeWidth="2" fill="none" />
                                        )}
                                    </svg>
                                </span>
                                <span className={reviewDetailsContentstyles.declareText}>
                                    I hereby certify that the information and photograph provided are accurate and complete. <br></br>I acknowledge that should any of this information be found to be false, misleading, or misrepresentative, <br></br>I may be held legally responsible.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
    );
};

export default ReviewDetailsPage;
