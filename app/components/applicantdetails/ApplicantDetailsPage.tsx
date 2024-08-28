"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import applicantDetailsContentstyles from './ApplicantDetailsContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import ImageProcessingPage from './ImageProcessing'
import { useFormContext } from '.././FormContext';
import { booking_schedules } from '@prisma/client';
type CheckboxState = {
    [key: string]: boolean;
};

const ApplicantDetailsPage: React.FC = () => {

    const { formData, setFormData } = useFormContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('id', event.target.id);
        console.log('value', event.target.value);
        console.log('name', event.target.name);
        const { id, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    // Initialize the state for checkboxes
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
        console.log('value', event.target.value);
        console.log('name', event.target.name);
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [applicationType, setApplicationType] = useState('');

    const [selectedOption, setSelectedOption] = useState<string>('');

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('target id', event.target.id)
        console.log('target value', event.target.value)
        setSelectedOption(event.target.value);
        setApplicationType(event.target.value);
        const { id, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));

    };


    useEffect(() => {
        // Set the selected option from formData if available
        if (formData.applicationType) {
            setSelectedOption(formData.applicationType);
            console.log('form data', formData);
            setCheckboxes({
                trRtt: formData?.trRtt || false,
                trCsspb: formData?.trCsspb || false,
                trCctc: formData?.trCctc || false,
                trHcta: formData?.trHcta || false,
                trXray: formData?.trXray || false,
                trAvso: formData?.trAvso || false,
                trNota: formData?.trNota || false,
                trObse: formData?.trObse || false,
                trSsm: formData?.trSsm || false,
            });
        }
    }, [formData]); // Empty dependency array ensures this runs only once

    return (

            <form>
                <div className={applicantDetailsContentstyles.paymentContainer}>
                    <div className={applicantDetailsContentstyles.applicantDetails}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Applicant Details
                            </div>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                Please select the pass card type you would like to apply for.
                            </div>
                        </div>

                        <div className={applicantDetailsContentstyles.options}>
                            <div className={applicantDetailsContentstyles.optionsHeader}>
                                <div className={applicantDetailsContentstyles.optionsHeaderText}>
                                    Type of application
                                </div>
                                <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                    <label>
                                        <input
                                            type="radio"
                                            value="SO"
                                            id="applicationType"
                                            checked={selectedOption === 'SO'}
                                            onChange={handleOptionChange}
                                        />
                                        Security Officer (SO)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="radio"
                                            value="AVSO"
                                            id="applicationType"
                                            checked={selectedOption === 'AVSO'}
                                            onChange={handleOptionChange}
                                        />
                                        Aviation Security Officer (AVSO)
                                    </label>
                                    <br />
                                    <label>
                                        <input
                                            type="radio"
                                            value="PI"
                                            id="applicationType"
                                            checked={selectedOption === 'PI'}
                                            onChange={handleOptionChange}
                                        />
                                        Private Investigator (PI)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={applicantDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={applicantDetailsContentstyles.paymentContainer}>

                    <div className={applicantDetailsContentstyles.applicantDetails}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Photo
                            </div>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                This photo will be used for your pass card.
                            </div>
                            <div className={applicantDetailsContentstyles.uploadPhotoBox}>
                                <ImageProcessingPage></ImageProcessingPage>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={applicantDetailsContentstyles.paymentContainerBackground}>

                </div>
                <div className={applicantDetailsContentstyles.paymentContainer}>


                    <div className={applicantDetailsContentstyles.applicantDetails}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                                Training records
                            </div>

                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                Types of trainings
                            </div>
                            <div className={applicantDetailsContentstyles.trainingOptionText}>
                                <span className={applicantDetailsContentstyles.trainingOptionBox}>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trAvso"
                                                checked={checkboxes.trAvso}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Airport Screener Deployment
                                        </label>

                                    </div>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trCctc"
                                                checked={checkboxes.trCctc}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Conduct Crowd and Traffic Control (CCTC)
                                        </label>

                                    </div>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trCsspb"
                                                checked={checkboxes.trCsspb}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Conduct Security Screening of Person and Bag (CSSPB)
                                        </label>

                                    </div>
                                    <div>
                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trXray"
                                                checked={checkboxes.trXray}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Conduct Screening using X-ray Machine (X-RAY)
                                        </label>
                                    </div>
                                    <div>
                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trNota"
                                                checked={checkboxes.trNota}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            None of the above (SO)
                                        </label>
                                    </div>
                                </span>
                                <span className={applicantDetailsContentstyles.trainingOptionBox}>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trHcta"
                                                checked={checkboxes.trHcta}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Handle Counter Terrorist Activities (HCTA)
                                        </label>

                                    </div>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trObsa"
                                                checked={checkboxes.trObsa}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Operate Basic Security Equipment
                                        </label>

                                    </div>
                                    <div>

                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trSsm"
                                                checked={checkboxes.trSsm}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Security Surveillance Management
                                        </label>

                                    </div>
                                    <div>
                                        <label className={applicantDetailsContentstyles.checkboxes}>
                                            <input
                                                type="checkbox"
                                                name="trRtt"
                                                checked={checkboxes.trRtt}
                                                onChange={handleCheckboxChange}
                                                className={applicantDetailsContentstyles.checkboxes}
                                            />
                                            Recognise Terrorist Threat (RTT)
                                        </label>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        
    );
};

export default ApplicantDetailsPage;
