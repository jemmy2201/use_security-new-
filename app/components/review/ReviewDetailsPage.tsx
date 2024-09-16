"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import reviewDetailsContentstyles from './ReviewDetailsContent.module.css';
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';

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

        <div className={reviewDetailsContentstyles.mainContainer}>
            <div className={reviewDetailsContentstyles.stepContentContainer}>
                <div className={globalStyleCss.header2}>
                    Personal details
                </div>
                <div className={reviewDetailsContentstyles.contentBox}>
                    <div className={reviewDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>Full name </div>
                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.name}</div></div>
                    </div>
                    <div className={reviewDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>NRIC/FIN No. </div>
                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.mobileno}</div></div>
                    </div>
                </div>

                <div className={reviewDetailsContentstyles.contentBox}>
                    <div className={reviewDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>Mobile number: </div>
                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.mobileno}}</div></div>

                    </div>
                    <div className={reviewDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>Email Address. </div>
                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.nricText}</div></div>

                    </div>
                </div>
            </div>

      


            <div className={reviewDetailsContentstyles.stepContentContainer}>

                <div className={globalStyleCss.header2}>
                    Photo
                </div>
                <div className={globalStyleCss.regular}>
                Please make sure your photo is compliant to prevent your application from being rejected.                  </div>
                <img src={formData.image} alt="Processed" />

            </div>

            <div className={reviewDetailsContentstyles.stepContentContainer}>


                <div className={globalStyleCss.header2}>
                    Training records
                </div>

                <div className={globalStyleCss.regularBold}>
                    Types of trainings
                </div>
                <div className={globalStyleCss.regular}>
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

            <div className={reviewDetailsContentstyles.stepContentContainer}>

                <div className={globalStyleCss.header2}>
                    Declaration
                </div>

                <div className={reviewDetailsContentstyles.declareBox} onClick={handleCheckboxToggle} style={{ cursor: 'pointer' }}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={isChecked ? "#546E7A" : "white"} stroke="#546E7A" />
                            {isChecked && (
                                <path d="M6 12l4 4 8-8" stroke="white" strokeWidth="2" fill="none" />
                            )}
                        </svg>
                    </div>
                    <div className={globalStyleCss.regular}>
                        I hereby certify that the information and photograph provided are accurate and complete. <br></br>I acknowledge that should any of this information be found to be false, misleading, or misrepresentative, <br></br>I may be held legally responsible.
                    </div>
                </div>
            </div>

                            </div>
        </form>
    );
};

export default ReviewDetailsPage;
