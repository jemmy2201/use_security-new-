"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import reviewDetailsContentstyles from './ReviewDetailsContent.module.css';
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import ReviewImageProcessing from './ReviewImageProcessing';
import Image from 'next/image';

type CheckboxState = {
    [key: string]: boolean;
};

const ReviewDetailsPage: React.FC = () => {

    const { formData, setFormData } = useFormContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [isChecked, setIsChecked] = useState(false);

    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        trRtt: false,
        trCsspb: false,
        trCctc: false,
        trHcta: false,
        trXray: false,
        trAvso: false,
        trNota: false,
        trObse: false,
        trSsm: false,
    });

    // Handle change event for checkboxes
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckboxes(prevState => ({
            ...prevState,
            [name]: checked,
        }));
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: checked,
        }));
    };

    // Toggle the checkbox state
    const handleCheckboxToggle = () => {
        setIsChecked(!isChecked);
        setFormData(prevFormData => ({
            ...prevFormData,
            ['isTermsAndConditionSigned']: !isChecked,
        }));
    };

    useEffect(() => {

        setIsChecked(formData?.isTermsAndConditionSigned || false);

    }, [formData.imageUrl, formData?.isTermsAndConditionSigned]);

    const [isEditingSection1, setIsEditingSection1] = useState(false);
    const [isEditingSection2, setIsEditingSection2] = useState(false);
    const [isEditingSection3, setIsEditingSection3] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const processedValue = id === 'email' ? value.trimEnd() : value;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: processedValue,
        }));
    };

    // Toggle edit mode for sections
    const toggleEditMode = (section: number) => {
        if (section === 1) setIsEditingSection1(!isEditingSection1);
        if (section === 2) setIsEditingSection2(!isEditingSection2);
        if (section === 3) setIsEditingSection3(!isEditingSection3);

        setCheckboxes({
            trRtt: formData?.trRtt ? true : false,
            trCsspb: formData?.trCsspb ? true : false,
            trCctc: formData?.trCctc ? true : false,
            trHcta: formData?.trHcta ? true : false,
            trXray: formData?.trXray ? true : false,
            trAvso: formData?.trAvso ? true : false,
            trNota: formData?.trNota ? true : false,
            trObse: formData?.trObse ? true : false,
            trSsm: formData?.trSsm ? true : false,
        });

    };

    return (

        <form>

            <div className={reviewDetailsContentstyles.mainContainer}>
                <section>

                    {isEditingSection1 ? (
                        <>

                            <div className={reviewDetailsContentstyles.stepContentContainer}>
                                <div className={reviewDetailsContentstyles.headerContentBox}>

                                    <div className={globalStyleCss.header2}>
                                        Personal details
                                    </div>
                                    <div className={reviewDetailsContentstyles.editLink} style={{ display: 'flex', alignItems: 'center'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1418_2800)">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1418_2800">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>&nbsp;
                                        <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(1)}>Save</button>
                                    </div>
                                </div>
                                <div className={reviewDetailsContentstyles.contentBox}>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>Full name </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.name}</div></div>
                                    </div>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>NRIC/FIN No. </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.nricText}</div></div>
                                    </div>
                                </div>

                                <div className={reviewDetailsContentstyles.contentBox}>
                                    <div className={reviewDetailsContentstyles.item}>

                                        <div className={globalStyleCss.regularBold}>Mobile number </div>
                                        <div className={globalStyleCss.regular}>
                                            <input
                                                type="text"
                                                id="mobileno"
                                                value={formData.mobileno || ''}
                                                onChange={handleChange}
                                                className={reviewDetailsContentstyles.inputBox}
                                                required placeholder="Enter your mobile number"
                                            />
                                        </div>
                                        <div className={globalStyleCss.regularBold}>
                                            {formData.errorMobileNumber && <p style={{ color: 'red' }}>{formData.errorMobileNumber}</p>}
                                        </div>
                                    </div>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>Email Address </div>
                                        <div className={globalStyleCss.regular}>
                                            <input
                                                type="text"
                                                id="email"
                                                value={formData.email || ''}
                                                onChange={handleChange}
                                                className={reviewDetailsContentstyles.inputBox}
                                                required placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className={globalStyleCss.regularBold}>
                                            {formData.errorEmail && <p style={{ color: 'red' }}>{formData.errorEmail}</p>}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* <button type='button' onClick={() => toggleEditMode(1)}>Submit</button> */}
                        </>
                    ) : (
                        <>
                            <div className={reviewDetailsContentstyles.stepContentContainer}>

                                <div className={reviewDetailsContentstyles.headerContentBox}>
                                    <span className={globalStyleCss.header2}>
                                        Personal details
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1418_2800)">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1418_2800">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>&nbsp;
                                        <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(1)}>Edit</button>
                                    </span>
                                </div>
                                <div className={reviewDetailsContentstyles.contentBox}>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>Full name </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.name}</div></div>
                                    </div>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>NRIC/FIN No. </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.nricText}</div></div>
                                    </div>
                                </div>

                                <div className={reviewDetailsContentstyles.contentBox}>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>Mobile number </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.mobileno}</div></div>
                                        <div className={globalStyleCss.regularBold}>
                                            {formData.errorMobileNumber && <p style={{ color: 'red' }}>{formData.errorMobileNumber}</p>}
                                        </div>
                                    </div>
                                    <div className={reviewDetailsContentstyles.item}>
                                        <div className={globalStyleCss.regularBold}>Email Address </div>
                                        <div className={reviewDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.email}</div></div>
                                        <div className={globalStyleCss.regularBold}>
                                            {formData.errorEmail && <p style={{ color: 'red' }}>{formData.errorEmail}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>


                <section>
                    {
                        isEditingSection2 ? (
                            <>
                                <div className={reviewDetailsContentstyles.stepContentContainer}>
                                    <div className={reviewDetailsContentstyles.headerContentBox}>

                                        <div className={globalStyleCss.header2}>
                                            Photo

                                        </div>


                                        <div className={reviewDetailsContentstyles.editLink} style={{ display: 'flex', alignItems: 'center'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <g clipPath="url(#clip0_1418_2800)">
                                                    <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1418_2800">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>&nbsp;
                                            <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(2)}>Save</button>
                                        </div>
                                    </div>


                                    <ReviewImageProcessing></ReviewImageProcessing>
                                </div>

                            </>

                        ) : (
                            <>
                                <div className={reviewDetailsContentstyles.stepContentContainer}>
                                    <div className={reviewDetailsContentstyles.headerContentBox}>

                                        <div className={globalStyleCss.header2}>
                                            Photo
                                        </div>


                                        <div className={reviewDetailsContentstyles.editLink} style={{ display: 'flex', alignItems: 'center'}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <g clipPath="url(#clip0_1418_2800)">
                                                    <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_1418_2800">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>&nbsp;
                                            <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(2)}>Edit</button>
                                        </div>

                                    </div>
                                    <div className={globalStyleCss.regular}>
                                        Please ensure your photo complies with the guidelines to prevent your application from being rejected.
                                        {formData.errorPhoto && <p style={{ color: 'red' }}>{formData.errorPhoto}</p>}

                                    </div>
                                    {formData.image ? (
                                        <>
                                            {formData.image && <Image src={formData.image} alt="Photo ID" height={200} width={257} />}
                                        </>
                                    ) : (
                                        <>
                                            {formData.imageUrl && <Image src={`/api/get-image?imageName=${formData.imageUrl}&t=${new Date().getTime()}`} alt="Photo ID" height={200} width={257} />}
                                        </>
                                    )

                                    }
                                </div>
                            </>
                        )}
                </section>

                <section>

                    {isEditingSection3 ? (
                        <>
                            <div className={reviewDetailsContentstyles.stepContentContainer}>

                                <div className={reviewDetailsContentstyles.headerContentBox}>

                                    <div className={globalStyleCss.header2}>
                                        Training records
                                    </div>


                                    <div className={reviewDetailsContentstyles.editLink} style={{ display: 'flex', alignItems: 'center'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1418_2800)">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1418_2800">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>&nbsp;
                                        <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(3)}>Save</button>
                                    </div>

                                </div>
                                <div className={globalStyleCss.regularBold}>
                                    Types of trainings
                                </div>

                                <div className={reviewDetailsContentstyles.trainingOptionContainer}>
                                    <div className={reviewDetailsContentstyles.trainingOptionBox}>

                                        {/* <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}>
                                                <input
                                                    type="checkbox"
                                                    name="trAvso"
                                                    checked={checkboxes.trAvso}
                                                    onChange={handleCheckboxChange}
                                                /> </div>
                                            <div>Airport Screener Deployment</div>
                                        </label> */}

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trCctc"
                                                checked={checkboxes.trCctc}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                Conduct Crowd and Traffic Control (CCTC)</div>
                                        </label>

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trCsspb"
                                                checked={checkboxes.trCsspb}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                Conduct Security Screening of Person and Bag (CSSPB)</div>
                                        </label>

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trNota"
                                                checked={checkboxes.trNota}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                None of the above (SO)</div>
                                        </label>

                                    </div>
                                    <div className={reviewDetailsContentstyles.trainingOptionBox}>

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trXray"
                                                checked={checkboxes.trXray}
                                                onChange={handleCheckboxChange}
                                            />
                                            </div> <div>Conduct Screening using X-ray Machine (X-RAY)</div>
                                        </label>

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trHcta"
                                                checked={checkboxes.trHcta}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                Handle Counter Terrorist Activities (HCTA)</div>
                                        </label>
                                        {/* <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trObse"
                                                checked={checkboxes.trObse}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                Operate Basic Security Equipment</div>
                                        </label>
                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}><input
                                                type="checkbox"
                                                name="trSsm"
                                                checked={checkboxes.trSsm}
                                                onChange={handleCheckboxChange}
                                            /> </div>
                                            <div> Security Surveillance Management</div>
                                        </label> */}

                                        <label className={reviewDetailsContentstyles.checkboxes}>
                                            <div className={globalStyleCss.regular}> <input
                                                type="checkbox"
                                                name="trRtt"
                                                checked={checkboxes.trRtt}
                                                onChange={handleCheckboxChange}
                                            /></div>
                                            <div>
                                                Recognise Terrorist Threat (RTT)</div>
                                        </label>
                                    </div>
                                </div>

                            </div>

                        </>
                    ) : (
                        <>
                            <div className={reviewDetailsContentstyles.stepContentContainer}>
                                <div className={reviewDetailsContentstyles.headerContentBox}>

                                    <div className={globalStyleCss.header2}>
                                        Training records
                                    </div>

                                    <div className={reviewDetailsContentstyles.editLink} style={{ display: 'flex', alignItems: 'center'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_1418_2800)">
                                                <path d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z" fill="#546E7A" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_1418_2800">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>&nbsp;
                                        <button className={globalStyleCss.blueLink} type='button' onClick={() => toggleEditMode(3)}>Edit</button>
                                    </div>

                                </div>
                                <div className={globalStyleCss.regularBold}>
                                    Types of trainings
                                </div>
                                <div className={reviewDetailsContentstyles.trainingOptionContainer}>
                                    <div className={globalStyleCss.regular}>
                                        {formData.trAvso ? <div className={globalStyleCss.regular}>Airport Screener Deployment</div> : ""}
                                        {formData.trCctc ? <div className={globalStyleCss.regular}>Conduct Crowd and Traffic Control (CCTC)</div> : ""}
                                        {formData.trCsspb ? <div className={globalStyleCss.regular}>Conduct Security Screening of Person and Bag (CSSPB)</div> : ""}
                                        {formData.trNota ? <div className={globalStyleCss.regular}>None of the above (SO)</div> : ""}
                                        {formData.trHcta ? <div className={globalStyleCss.regular}>Handle Counter Terrorist Activities (HCTA)</div> : ""}
                                        {formData.trXray ? <div className={globalStyleCss.regular}>Conduct Screening using X-ray Machine (X-RAY)</div> : ""}
                                        {formData.trObsa ? <div className={globalStyleCss.regular}>Operate Basic Security Equipment</div> : ""}
                                        {formData.trSsm ? <div className={globalStyleCss.regular}>Security Surveillance Management</div> : ""}
                                        {formData.trRtt ? <div className={globalStyleCss.regular}>Recognise Terrorist Threat (RTT)</div> : ""}
                                    </div>
                                </div>


                            </div>
                        </>
                    )}
                </section>

                <div className={reviewDetailsContentstyles.stepContentContainer}>

                    <div className={reviewDetailsContentstyles.headerContentBox}>
                        <div className={globalStyleCss.header2}>
                            Declaration
                        </div>
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
                            I hereby certify that the information and photograph provided are accurate and complete. I acknowledge that if any of the information is found to be false, misleading, or misrepresented,
                            I may be held legally responsible.
                            {formData.errorDeclaration && <p style={{ color: 'red' }}>{formData.errorDeclaration}</p>}
                        </div>
                    </div>
                </div>

            </div>
        </form >
    );
};

export default ReviewDetailsPage;
