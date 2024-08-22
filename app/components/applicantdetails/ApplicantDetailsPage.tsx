"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import applicantDetailsContentstyles from './ApplicantDetailsContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import ImageProcessingPage from './ImageProcessing'
import bookingDetailData from '../../types/bookingDetailDataObject'

type CheckboxState = {
    [key: string]: boolean;
};

const ApplicantDetailsPage: React.FC = () => {

    // Initialize the state for checkboxes
    const [checkboxes, setCheckboxes] = useState<CheckboxState>({
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
        checkbox4: false,
    });

    // Handle change event for checkboxes
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckboxes(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [applicationType, setApplicationType] = useState('');

    const [bookingDetailData, setBookingDetailData] = useState<bookingDetailData>({
        id: '',
        nric: '',
        trXray: '',
        trAvso: '',
        
    });

    const [selectedOption, setSelectedOption] = useState<string>('SO');

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        setBookingDetailData({ ...bookingDetailData, appType: event.target.value });
        setApplicationType(event.target.value);
        localStorage.setItem('applicantDetails: bookingDetailData', JSON.stringify(bookingDetailData));
    };

    useEffect(() => {
        const storedBookingDetailData = localStorage.getItem('bookingDetailData');
        if (storedBookingDetailData) {
            try {
                const parsedBookingDetailData: bookingDetailData = JSON.parse(storedBookingDetailData);
                console.log('applicantDetails: storedBookingDetail data', parsedBookingDetailData);
                setBookingDetailData(parsedBookingDetailData);
            } catch (err) {
                setError('Failed to parse BookingDetail data');
            }
        } else {
            setError('No BookingDetail data found');
        }
    }, []);


    return (

        <div className={applicantDetailsContentstyles.paymentContainer}>
            <form>
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
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="SO"
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
                                        checked={selectedOption === 'PI'}
                                        onChange={handleOptionChange}
                                    />
                                    Private Investigator (PI)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={applicantDetailsContentstyles.applicantDetails}>
                    <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Photo
                        </div>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            This photo will be used for your pass card. Please upload a photo that was taken within the last 3 months.
                        </div>
                        <ImageProcessingPage></ImageProcessingPage>
                    </div>
                </div>



                <div className={applicantDetailsContentstyles.applicantDetails}>
                    <div className={applicantDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Training records
                        </div>

                        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Types of trainings
                        </div>
                        <div>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <input
                                    type="checkbox"
                                    name="checkbox1"
                                    checked={checkboxes.checkbox1}
                                    onChange={handleCheckboxChange}
                                    className={applicantDetailsContentstyles.checkboxes}
                                />
                                Recognise Terrorist Threat (RTT)
                            </label>
                        </div>
                        <div>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <input
                                    type="checkbox"
                                    name="checkbox2"
                                    checked={checkboxes.checkbox2}
                                    onChange={handleCheckboxChange}
                                    className={applicantDetailsContentstyles.checkboxes}
                                />
                                Recognise Terrorist Threat (RTT)
                            </label>
                        </div>
                        <div>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <input
                                    type="checkbox"
                                    name="checkbox3"
                                    checked={checkboxes.checkbox3}
                                    onChange={handleCheckboxChange}
                                    className={applicantDetailsContentstyles.checkboxes}
                                />
                                Recognise Terrorist Threat (RTT)
                            </label>
                        </div>
                        <div>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <input
                                    type="checkbox"
                                    name="checkbox4"
                                    checked={checkboxes.checkbox4}
                                    onChange={handleCheckboxChange}
                                    className={applicantDetailsContentstyles.checkboxes}
                                />
                                Recognise Terrorist Threat (RTT)
                            </label>
                        </div>
                        <div>
                            <label className={applicantDetailsContentstyles.checkboxes}>
                                <input
                                    type="checkbox"
                                    name="checkbox5"
                                    checked={checkboxes.checkbox5}
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
                                    name="checkbox6"
                                    checked={checkboxes.checkbox6}
                                    onChange={handleCheckboxChange}
                                    className={applicantDetailsContentstyles.checkboxes}
                                />
                                Airport Screener Deployment (For AVSO Only)
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ApplicantDetailsPage;
