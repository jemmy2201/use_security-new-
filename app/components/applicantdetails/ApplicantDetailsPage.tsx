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


export interface createNewPassApiResponse {
    errorCode?: string;
    errorMessage?: string;
    canCreateSoApplication?: boolean;
    canCreatePiApplication?: boolean;
    canCreateAvsoApplication?: boolean;
    passId?: string;
    recordId: string;
}

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

        const storedBookingData = sessionStorage.getItem('bookingSchedule');
        if (storedBookingData) {
            try {
                const parsedBookingData: booking_schedules = JSON.parse(storedBookingData);
                const fileName = parsedBookingData?.passid + parsedBookingData.nric.slice(-4);
                console.log('image file name:', fileName);
                // Initialize formData only if it's empty
                setFormData(prevFormData => ({
                    ...prevFormData,
                    applicationType: parsedBookingData.app_type == '1' ? 'SO' : '',
                    trAvso: parsedBookingData.TR_AVSO || false,
                    trCctc: parsedBookingData.TR_CCTC || false,
                    trCsspb: parsedBookingData.TR_CSSPB || false,
                    trHcta: parsedBookingData.TR_HCTA || false,
                    trRtt: parsedBookingData.TR_RTT || false,
                    trXray: parsedBookingData.TR_X_RAY || false,
                    imageUrl: `/uploads/${fileName}.png`,
                }));
                setCheckboxes({
                    trRtt: parsedBookingData?.TR_RTT || false,
                    trCsspb: parsedBookingData?.TR_CSSPB || false,
                    trCctc: parsedBookingData?.TR_CCTC || false,
                    trHcta: parsedBookingData?.TR_HCTA || false,
                    trXray: parsedBookingData?.TR_X_RAY || false,
                    trAvso: parsedBookingData?.TR_AVSO || false,
                });
            } catch (err) {
                setError('Failed to parse user data');
            }
            sessionStorage.removeItem('bookingSchedule');
        } else {
            setError('No user data found');
        }
    }, [formData]); // Empty dependency array ensures this runs only once

    return (

        <form>
            <div className={applicantDetailsContentstyles.paymentContainer}>
                <div className={applicantDetailsContentstyles.applicantDetails}>
                    <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>Applicant Details</h1>
                        </div>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            <h1>Please select the pass card type you would like to apply for.</h1>
                        </div>
                    </div>

                    <div className={applicantDetailsContentstyles.options}>
                        <div className={applicantDetailsContentstyles.optionsHeader}>
                            <div className={applicantDetailsContentstyles.optionsHeaderText}>
                                <h1>Type of application</h1>
                            </div>
                            <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                
                                <label><h1>
                                    <input
                                        type="radio"
                                        value="SO"
                                        id="applicationType"
                                        checked={selectedOption === 'SO'}
                                        onChange={handleOptionChange}
                                    />
                                    Security Officer (SO)</h1>
                                </label>
                                <label><h2>
                                    <input
                                        type="radio"
                                        value="AVSO"
                                        id="applicationType"
                                        checked={selectedOption === 'AVSO'}
                                        onChange={handleOptionChange}
                                    />
                                    Aviation Security Officer (AVSO)</h2>
                                </label>
                                <label><h1>
                                    <input
                                        type="radio"
                                        value="PI"
                                        id="applicationType"
                                        checked={selectedOption === 'PI'}
                                        onChange={handleOptionChange}
                                    />
                                    Private Investigator (PI)</h1>
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
                            <h1>Photo</h1>
                        </div>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            <h1>This photo will be used for your pass card.</h1>
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
                            <h1>Training records</h1>
                        </div>

                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            <h1>Types of trainings</h1>
                        </div>
                        <div className={applicantDetailsContentstyles.trainingOptionText}>
                            <span className={applicantDetailsContentstyles.trainingOptionBox}>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1>
                                        <input
                                            type="checkbox"
                                            name="trAvso"
                                            checked={checkboxes.trAvso}
                                            onChange={handleCheckboxChange}
                                        />
                                        Airport Screener Deployment</h1>
                                    </label>

                                </div>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trCctc"
                                            checked={checkboxes.trCctc}
                                            onChange={handleCheckboxChange}
                                        />
                                        Conduct Crowd and Traffic Control (CCTC)</h1>
                                    </label>

                                </div>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trCsspb"
                                            checked={checkboxes.trCsspb}
                                            onChange={handleCheckboxChange}
                                        />
                                        Conduct Security Screening of Person and Bag (CSSPB)</h1>
                                    </label>

                                </div>
                                <div>
                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trXray"
                                            checked={checkboxes.trXray}
                                            onChange={handleCheckboxChange}
                                        />
                                        Conduct Screening using X-ray Machine (X-RAY)</h1>
                                    </label>
                                </div>
                                <div>
                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trNota"
                                            checked={checkboxes.trNota}
                                            onChange={handleCheckboxChange}
                                        />
                                        None of the above (SO)</h1>
                                    </label>
                                </div>
                            </span>
                            <span className={applicantDetailsContentstyles.trainingOptionBox}>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trHcta"
                                            checked={checkboxes.trHcta}
                                            onChange={handleCheckboxChange}
                                        />
                                        Handle Counter Terrorist Activities (HCTA)</h1>
                                    </label>

                                </div>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trObsa"
                                            checked={checkboxes.trObsa}
                                            onChange={handleCheckboxChange}
                                        />
                                        Operate Basic Security Equipment</h1>
                                    </label>

                                </div>
                                <div>

                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                        <h1><input
                                            type="checkbox"
                                            name="trSsm"
                                            checked={checkboxes.trSsm}
                                            onChange={handleCheckboxChange}
                                        />
                                        Security Surveillance Management</h1>
                                    </label>

                                </div>
                                <div>
                                    <label className={applicantDetailsContentstyles.checkboxes}>
                                       <h1> <input
                                            type="checkbox"
                                            name="trRtt"
                                            checked={checkboxes.trRtt}
                                            onChange={handleCheckboxChange}
                                        />
                                        Recognise Terrorist Threat (RTT)</h1>
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
