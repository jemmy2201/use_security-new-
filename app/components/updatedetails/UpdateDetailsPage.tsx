"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import updateDetailsContentstyles from './UpdateDetailsContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { booking_schedules as bookingDetail } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useFormContext } from '.././FormContext';
import { booking_schedules } from '@prisma/client';
import OtpPopup from './OtpPopup';

interface UpdateDetailsPageProps {
    bookingId: string;
}

type CheckboxState = {
    [key: string]: boolean;
};

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const UpdateDetailsPage: React.FC<UpdateDetailsPageProps> = ({ bookingId }) => {
    console.log('UpdateDetailsPage Booking ID:', bookingId);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { formData, setFormData } = useFormContext();
    const [isOtpPopupOpen, setIsOtpPopupOpen] = useState<boolean>(false); // State for OTP popup

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));
    };

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


    const onBack = async () => {

        try {
            const responseUser = await fetch('/api/myinfo');
            if (!responseUser.ok) {
                console.log('no user detail found hence redirecting to firsttime page');
                router.push('/firsttime');
            }
            const dataUser: userInfo = await responseUser.json();

            sessionStorage.setItem('users', JSON.stringify(dataUser));
            console.log('data from api', dataUser);

            const response = await fetch('/api/dashboard');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: bookingDetail[] = await response.json();
            console.log('booking card list: ', data.length);
            if (data.length === 0) {
                console.log('No booking details found.');
                router.push('/firsttime');
            } else {
                sessionStorage.setItem('bookingSchedules', JSON.stringify(data));
                console.log('data from api', data);
                router.push('/dashboard');
            }
        } catch (err) {
            setErrorMessage('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const onNext = async () => {
        try {


            if (formData.originalMobileno === formData.mobileno
                || (formData.isOtpVerified && formData.mobileno == formData.verifiedMobileNo)) {
                console.log('same mobile');
                setIsOtpPopupOpen(false);
            } else {
                console.log('mobile changed');
                const response = await fetch('/api/sms/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData.mobileno),
                });
                const result = await response.json();

                if (result.success) {
                    console.log('SMS sent:', result);
                } else {
                    console.error('Failed to send SMS:', result.message);
                }
                setIsOtpPopupOpen(true);
                return;
            }

            const response = await fetch('/api/update-personal-details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    mobileno: formData.mobileno,
                    email: formData.email,
                    trRtt: formData.trRtt ? 'YES' : '',
                    trCsspb: formData.trCsspb ? 'YES' : '',
                    trCctc: formData.trCctc ? 'YES' : '',
                    trHcta: formData.trHcta ? 'YES' : '',
                    trXray: formData.trXray ? 'YES' : '',
                    trAvso: formData.trAvso ? 'YES' : '',
                    trNota: formData.trNota ? 'YES' : '',
                    trSsm: formData.trSsm ? 'YES' : '',
                    trObse: formData.trObse ? 'YES' : '',
                }),
            });
            if (!response.ok) {
                throw new Error('Update personal details: Failed to save');
            }
            const result = await response.json();
            console.log("Update personal details: Saved successfully:", result);

            console.log('bookingId', bookingId);

            onBack();

        } catch (err) {
            setErrorMessage('Failed to fetch reschedule');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpCancel = () => {
        setIsOtpPopupOpen(false); // Close OTP popup if user cancels
    };

    useEffect(() => {

        const fetchBookingSchedule = async () => {
            try {
                const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
                if (!responseBookingSchedule.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();

                const responseMyInfo = await fetch('/api/myinfo');
                if (!responseMyInfo.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataMyInfo: userInfo = await responseMyInfo.json();

                setFormData({
                    email: dataMyInfo?.email ?? '',
                    originalMobileno: dataMyInfo?.mobileno ?? '',
                    mobileno: dataMyInfo?.mobileno ?? '',
                    nric: dataBookingSchedule?.nric ?? '',
                    passId: dataBookingSchedule.passid,
                    trAvso: dataBookingSchedule.TR_AVSO || false,
                    trCctc: dataBookingSchedule.TR_CCTC || false,
                    trCsspb: dataBookingSchedule.TR_CSSPB || false,
                    trHcta: dataBookingSchedule.TR_HCTA || false,
                    trRtt: dataBookingSchedule.TR_RTT || false,
                    trXray: dataBookingSchedule.TR_X_RAY || false,
                    trNota: dataBookingSchedule.TR_NOTA || false,
                    trObse: dataBookingSchedule.TR_OBSE || false,
                    trSsm: dataBookingSchedule.TR_SSM || false,
                });

                setCheckboxes({
                    trRtt: dataBookingSchedule?.TR_RTT || false,
                    trCsspb: dataBookingSchedule?.TR_CSSPB || false,
                    trCctc: dataBookingSchedule?.TR_CCTC || false,
                    trHcta: dataBookingSchedule?.TR_HCTA || false,
                    trXray: dataBookingSchedule?.TR_X_RAY || false,
                    trAvso: dataBookingSchedule?.TR_AVSO || false,
                    trNota: dataBookingSchedule?.TR_X_RAY || false,
                    trObse: dataBookingSchedule?.TR_X_RAY || false,
                    trSsm: dataBookingSchedule?.TR_X_RAY || false,
                    trNota: dataBookingSchedule.TR_NOTA || false,
                    trObse: dataBookingSchedule.TR_OBSE || false,
                    trSsm: dataBookingSchedule.TR_SSM || false,
                });
            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            }
        };
        fetchBookingSchedule();
    }, []);

    return (

        <form>
            <div >
                <HeaderPageLink />
            </div>
            <div className={updateDetailsContentstyles.mainContainer}>
                <div className={updateDetailsContentstyles.headerBox}>
                    <div className={globalStyleCss.header1}>
                        Update details
                    </div>
                </div>

                <div className={updateDetailsContentstyles.appointmentDetailContainer}>
                    <div className={updateDetailsContentstyles.header}>
                        <div className={globalStyleCss.header2}>
                            Personal details
                        </div>
                        <div className={updateDetailsContentstyles.contentBox}>
                            <div className={updateDetailsContentstyles.item}>
                                <div className={globalStyleCss.regularBold}>Mobile number: </div>
                                <div className={globalStyleCss.regular}>
                                    <input
                                        type="text"
                                        id="mobileno"
                                        value={formData.mobileno || ''}
                                        onChange={handleChange}
                                        className={updateDetailsContentstyles.inputBox}
                                        required placeholder="Enter your mobile number"
                                    /></div>
                            </div>
                            <div className={updateDetailsContentstyles.item}>
                                <div className={globalStyleCss.regularBold}>Email Address. </div>
                                <div className={globalStyleCss.regular}>
                                    <input
                                        type="text"
                                        id="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className={updateDetailsContentstyles.inputBox}
                                        required placeholder="Enter your email"
                                    />
                                </div>
                                <OtpPopup
                                    isOpen={isOtpPopupOpen}
                                    onClose={handleOtpCancel}
                                />
                            </div>
                        </div>
                    </div>

                </div>


                <div className={updateDetailsContentstyles.appointmentDetailContainer}>
                    <div className={globalStyleCss.header2}>
                        Training records
                    </div>

                    <div className={globalStyleCss.regularBold}>
                        Types of trainings
                    </div>
                    <div className={updateDetailsContentstyles.trainingOptionContainer}>
                        <div className={updateDetailsContentstyles.trainingOptionBox}>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}>
                                    <input
                                        type="checkbox"
                                        name="trAvso"
                                        checked={checkboxes.trAvso}
                                        onChange={handleCheckboxChange}
                                    />
                                    Airport Screener Deployment</div>
                            </label>


                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCctc"
                                    checked={checkboxes.trCctc}
                                    onChange={handleCheckboxChange}
                                />
                                    Conduct Crowd and Traffic Control (CCTC)</div>
                            </label>




                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCsspb"
                                    checked={checkboxes.trCsspb}
                                    onChange={handleCheckboxChange}
                                />
                                    Conduct Security Screening of Person and Bag (CSSPB)</div>
                            </label>



                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trXray"
                                    checked={checkboxes.trXray}
                                    onChange={handleCheckboxChange}
                                />
                                    Conduct Screening using X-ray Machine (X-RAY)</div>
                            </label>


                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trNota"
                                    checked={checkboxes.trNota}
                                    onChange={handleCheckboxChange}
                                />
                                    None of the above (SO)</div>
                            </label>

                        </div>
                        <div className={updateDetailsContentstyles.trainingOptionBox}>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trHcta"
                                    checked={checkboxes.trHcta}
                                    onChange={handleCheckboxChange}
                                />
                                    Handle Counter Terrorist Activities (HCTA)</div>
                            </label>
                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trObse"
                                    checked={checkboxes.trObse}
                                    onChange={handleCheckboxChange}
                                />
                                    Operate Basic Security Equipment</div>
                            </label>
                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trSsm"
                                    checked={checkboxes.trSsm}
                                    onChange={handleCheckboxChange}
                                />
                                    Security Surveillance Management</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}> <input
                                    type="checkbox"
                                    name="trRtt"
                                    checked={checkboxes.trRtt}
                                    onChange={handleCheckboxChange}
                                />
                                    Recognise Terrorist Threat (RTT)</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className={updateDetailsContentstyles.buttonContainer}>
                    <button className={updateDetailsContentstyles.saveDraft} type='button' onClick={onBack} style={{ marginRight: '10px' }}>
                        <div className={globalStyleCss.regular}>Cancel</div>
                    </button>
                    <button className={updateDetailsContentstyles.continue} type='button' onClick={onNext}>
                        <div className={globalStyleCss.buttonText}>Save changes</div>
                    </button>
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default UpdateDetailsPage;
