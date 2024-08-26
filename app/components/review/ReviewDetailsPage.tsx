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

    return (

        <div>
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
                            {formData.trAvso ? <div>Airport Screener Deployment (For AVSO Only)</div> : ""}
                            {formData.trCctc ? <div>Conduct Crowd and Traffic Control (CCTC)</div> : ""}
                            {formData.trCsspb ? <div>Conduct Security Screening of Person and Bag (CSSPB)</div> : ""}
                            {formData.trHcta ? <div>Handle Counter Terrorist Activities (HCTA)</div> : ""}
                            {formData.trRtt ? <div>Recognise Terrorist Threat (RTT)</div> : ""}
                            {formData.trXray ? <div>Conduct Screening using X-ray Machine (X-RAY)</div> : ""}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewDetailsPage;
