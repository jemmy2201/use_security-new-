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
                            <h1>Personal Details</h1>
                        </div>
                    </div>
                    <div className={reviewDetailsContentstyles.alignFles}>
                        <span>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                <h1> Full name</h1>
                            </div>
                            <div>
                                <h1> {formData.name} </h1>
                            </div>
                            <div className={reviewDetailsContentstyles.divGap}> </div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                <h2>  Mobile number</h2>
                            </div>
                            <div>
                                <h2>  {formData.mobileno}</h2>
                            </div>
                        </span>
                        <span>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                <h1>  NRIC / FIN No.</h1>
                            </div>
                            <div>
                                <h1> {formData.nricText}</h1>
                            </div>
                            <div className={reviewDetailsContentstyles.divGap}> </div>
                            <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                <h2>  Email address</h2>
                            </div>
                            <div>
                                <h2>  {formData.email}</h2>
                            </div>
                        </span>
                    </div>


                </div>
            </div>
            <div className={reviewDetailsContentstyles.paymentContainerBackground}>

            </div>
            <div className={reviewDetailsContentstyles.paymentContainer}>

                <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>  Applicant Details</h1>
                        </div>
                        <div className={reviewDetailsContentstyles.options}>
                            <div className={reviewDetailsContentstyles.optionsHeader}>
                                <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                    <h1> Type of application</h1>
                                </div>
                                <div><h1>
                                    {formData.applicationType == "SO" ? <div>Security Officer (SO)</div> : ""}
                                    {formData.applicationType == "AVSO" ? <div>Aviation Security Officer (AVSO)</div> : ""}
                                    {formData.applicationType == "PI" ? <div>Private Investigator (PI)</div> : ""}
                                </h1>
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
                            <h1>   Photo</h1>
                        </div>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            <h1>  Please make sure your photo meets our photo guidelines to prevent your application from being rejected.  </h1>                      </div>
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
                            <h1>  Training records</h1>
                        </div>

                        <div className={reviewDetailsContentstyles.optionsHeaderText}>
                            Types of trainings
                        </div><h1>
                            {formData.trAvso ? <div>Airport Screener Deployment</div> : ""}
                            {formData.trCctc ? <div>Conduct Crowd and Traffic Control (CCTC)</div> : ""}
                            {formData.trCsspb ? <div>Conduct Security Screening of Person and Bag (CSSPB)</div> : ""}
                            {formData.trNota ? <div>None of the above (SO)</div> : ""}
                            {formData.trHcta ? <div>Handle Counter Terrorist Activities (HCTA)</div> : ""}
                            {formData.trXray ? <div>Conduct Screening using X-ray Machine (X-RAY)</div> : ""}
                            {formData.trObsa ? <div>Operate Basic Security Equipment</div> : ""}
                            {formData.trSsm ? <div>Security Surveillance Management</div> : ""}
                            {formData.trRtt ? <div>Recognise Terrorist Threat (RTT)</div> : ""}
                        </h1>
                    </div>
                </div>
            </div>
            <div className={reviewDetailsContentstyles.paymentContainerBackground}>

            </div>
            <div className={reviewDetailsContentstyles.paymentContainer}>
                <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>  Declaration</h1>
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
                                <h1> I hereby certify that the information and photograph provided are accurate and complete. <br></br>I acknowledge that should any of this information be found to be false, misleading, or misrepresentative, <br></br>I may be held legally responsible.</h1>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ReviewDetailsPage;
