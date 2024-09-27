"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import applicantDetailsContentstyles from './ApplicantDetailsContent.module.css';
import ImageProcessingPage from './ImageProcessing'
import { useFormContext } from '.././FormContext';
import { booking_schedules } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';

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
    cardId: string;
    grandTotal: string;
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
        console.log('ApplicantDetailsPage: Action Type', formData.actionType);

        console.log('form data', formData);
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


        const storedBookingData = sessionStorage.getItem('bookingSchedule');
        if (storedBookingData && !formData.isDataLoaded) {
            try {
                const parsedBookingData: booking_schedules = JSON.parse(storedBookingData);
                const fileName = parsedBookingData?.passid + parsedBookingData.nric.slice(-4);
                console.log('image file name:', fileName);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    isDataLoaded: true,
                    trAvso: parsedBookingData.TR_AVSO || false,
                    trCctc: parsedBookingData.TR_CCTC || false,
                    trCsspb: parsedBookingData.TR_CSSPB || false,
                    trHcta: parsedBookingData.TR_HCTA || false,
                    trRtt: parsedBookingData.TR_RTT || false,
                    trXray: parsedBookingData.TR_X_RAY || false,
                    trNota: parsedBookingData.TR_NOTA || false,
                    trObse: parsedBookingData.TR_OBSE || false,
                    trSsm: parsedBookingData.TR_SSM || false,
                    imageUrl: `/uploads/${fileName}.png`,
                    grandTotal: parsedBookingData.grand_total,
                }));
                setCheckboxes({
                    trRtt: parsedBookingData?.TR_RTT ? true: false,
                    trCsspb: parsedBookingData?.TR_CSSPB ? true: false,
                    trCctc: parsedBookingData?.TR_CCTC ? true: false,
                    trHcta: parsedBookingData?.TR_HCTA ? true: false,
                    trXray: parsedBookingData?.TR_X_RAY ? true: false,
                    trAvso: parsedBookingData?.TR_AVSO ? true: false,
                    trNota: parsedBookingData.TR_NOTA ? true: false,
                    trObse: parsedBookingData.TR_OBSE ? true: false,
                    trSsm: parsedBookingData.TR_SSM ? true: false,
                });
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
    }, []);

    return (

        <form>
            <div className={applicantDetailsContentstyles.mainContainer}>
                <ImageProcessingPage></ImageProcessingPage>

                <div className={applicantDetailsContentstyles.stepContentContainer}>
                    <div className={globalStyleCss.header2}>
                        Training records
                    </div>
                    {formData.errorTrainingRecords && <p style={{ color: 'red' }}>{formData.errorTrainingRecords}</p>}
                    <div className={globalStyleCss.regularBold}>
                        Types of trainings
                    </div>
                    <div className={applicantDetailsContentstyles.trainingOptionContainer}>
                        <div className={applicantDetailsContentstyles.trainingOptionBox}>

                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}>
                                    <input
                                        type="checkbox"
                                        name="trAvso"
                                        checked={checkboxes.trAvso}
                                        onChange={handleCheckboxChange}
                                    /> </div>
                                <div>Airport Screener Deployment</div>
                            </label>

                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCctc"
                                    checked={checkboxes.trCctc}
                                    onChange={handleCheckboxChange}
                                /></div>
                                <div>
                                    Conduct Crowd and Traffic Control (CCTC)</div>
                            </label>

                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCsspb"
                                    checked={checkboxes.trCsspb}
                                    onChange={handleCheckboxChange}
                                /></div>
                                <div>
                                    Conduct Security Screening of Person and Bag (CSSPB)</div>
                            </label>

                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trXray"
                                    checked={checkboxes.trXray}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Conduct Screening using X-ray Machine (X-RAY)</div>
                            </label>

                            <label className={applicantDetailsContentstyles.checkboxes}>
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
                        <div className={applicantDetailsContentstyles.trainingOptionBox}>

                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trHcta"
                                    checked={checkboxes.trHcta}
                                    onChange={handleCheckboxChange}
                                /></div>
                                <div>
                                    Handle Counter Terrorist Activities (HCTA)</div>
                            </label>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trObse"
                                    checked={checkboxes.trObse}
                                    onChange={handleCheckboxChange}
                                /></div>
                                <div>
                                    Operate Basic Security Equipment</div>
                            </label>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trSsm"
                                    checked={checkboxes.trSsm}
                                    onChange={handleCheckboxChange}
                                /> </div>
                                <div> Security Surveillance Management</div>
                            </label>

                            <label className={applicantDetailsContentstyles.checkboxes}>
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
            </div>
        </form >

    );
};

export default ApplicantDetailsPage;
