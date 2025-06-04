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
import UpdateModel from './UpdateModel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';

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
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [pwmEnable, setPwmEnable] = useState<boolean>(true);
    const [pwmEnable2, setPwmEnable2] = useState<boolean>(true);
    const [pwmEnable3, setPwmEnable3] = useState<boolean>(true);
    const [pwmEnable4, setPwmEnable4] = useState<boolean>(true);
    const [pwmEnable5, setPwmEnable5] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMobileMessage, setErrorMobileMessage] = useState('');
    const { formData, setFormData } = useFormContext();
    const [isOtpPopupOpen, setIsOtpPopupOpen] = useState<boolean>(false);
    const [isModelPopupOpen, setIsModelPopupOpen] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            pwmGrade: event.target.value,
        }));
    };


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
    };


    const onBack = async () => {
        try {
            router.push('/homepage');
        } catch (err) {
            setErrorMessage('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const onNext = async () => {

        try {
            setLoading(true);
            let validStepZero = true;
            if (!formData.email) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errorEmail: 'Please enter the email',
                }))
                validStepZero = false;
            } else {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errorEmail: '',
                }))
            }
            if (!formData.mobileno) {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errorMobileNumber: 'Please enter the mobile number',
                }))
                validStepZero = false;
            } else {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    errorMobileNumber: '',
                }))
            }
            if (!validStepZero) {
                setLoading(false);
                return;
            }

            if (formData.originalMobileno === formData.mobileno
                || (formData.isOtpVerified && formData.mobileno == formData.verifiedMobileNo)) {
                setIsOtpPopupOpen(false);
            } else {
                const response = await fetch('/api/sms/send-sms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mobile: formData.mobileno,
                    }),
                });
                const result = await response.json();

                if (result.success) {
                    setLoading(false);
                    setIsOtpPopupOpen(true);
                } else {
                    setLoading(false);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        errorMobileNumber: result.message,
                    }))
                }
                setLoading(false);
                return;
            }
            setLoading(false);
            setIsModelPopupOpen(true);

        } catch (err) {
            setErrorMessage('Failed to fetch reschedule');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpCancel = () => {
        setIsOtpPopupOpen(false);
    };

    useEffect(() => {
        if (formData.isUpdated) {
            toast.success('Details successfully updated', {
                position: 'top-right',
                autoClose: 3000,
                onClose: () => onBack()
            });
        }
    }, [formData.isUpdated]);

    const handleModelOtpCancel = () => {
        setIsModelPopupOpen(false);
    };

    useEffect(() => {

        const fetchBookingSchedule = async () => {
            try {
                setLoading(true);
                const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
                if (!responseBookingSchedule.ok && responseBookingSchedule.status === 401) {
                    setLoading(false);
                    router.push('/signin');
                    throw new Error('Log out');
                }
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
                    trAvso: dataBookingSchedule.TR_AVSO ? 'YES' : '',
                    trCctc: dataBookingSchedule.TR_CCTC ? 'YES' : '',
                    trCsspb: dataBookingSchedule.TR_CSSPB ? 'YES' : '',
                    trHcta: dataBookingSchedule.TR_HCTA ? 'YES' : '',
                    trRtt: dataBookingSchedule.TR_RTT ? 'YES' : '',
                    trXray: dataBookingSchedule.TR_X_RAY ? 'YES' : '',
                    trNota: dataBookingSchedule.TR_NOTA ? 'YES' : '',
                    trObse: dataBookingSchedule.TR_OBSE ? 'YES' : '',
                    trSsm: dataBookingSchedule.TR_SSM ? 'YES' : '',
                });

                setCheckboxes({
                    trRtt: dataBookingSchedule?.TR_RTT ? true : false,
                    trCsspb: dataBookingSchedule?.TR_CSSPB ? true : false,
                    trCctc: dataBookingSchedule?.TR_CCTC ? true : false,
                    trHcta: dataBookingSchedule?.TR_HCTA ? true : false,
                    trXray: dataBookingSchedule?.TR_X_RAY ? true : false,
                    trAvso: dataBookingSchedule?.TR_AVSO ? true : false,
                    trNota: dataBookingSchedule?.TR_NOTA ? true : false,
                    trObse: dataBookingSchedule?.TR_OBSE ? true : false,
                    trSsm: dataBookingSchedule?.TR_SSM ? true : false,
                });

                if(dataBookingSchedule.grade_id=='2'){
                    setPwmEnable(false);
                }
                if(dataBookingSchedule.grade_id=='3'){
                    setPwmEnable(false);
                    setPwmEnable2(false);
                }
                if(dataBookingSchedule.grade_id=='4'){
                    setPwmEnable(false);
                    setPwmEnable2(false);
                    setPwmEnable3(false);
                }
                if(dataBookingSchedule.grade_id=='5'){
                    setPwmEnable(false);
                    setPwmEnable2(false);
                    setPwmEnable3(false);
                    setPwmEnable4(false);
                }
            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingSchedule();
    }, []);

    return (

        <form>
            <ToastContainer />
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}

            <HeaderPageLink />

            <div className={updateDetailsContentstyles.mainContainer}>
                <div className={updateDetailsContentstyles.headerBox}>
                    <div className={globalStyleCss.header1}>
                        Update details
                    </div>
                </div>

                <div className={updateDetailsContentstyles.appointmentDetailContainer}>
                    <div className={globalStyleCss.header2}>
                        Personal details
                    </div>
                    <div className={updateDetailsContentstyles.contentBox}>
                        <div className={updateDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Mobile number:
                                {formData.errorMobileNumber && <p style={{ color: 'red' }}>{formData.errorMobileNumber}</p>}
                            </div>
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
                            <div className={globalStyleCss.regularBold}>Email Address.
                                {formData.errorEmail && <p style={{ color: 'red' }}>{formData.errorEmail}</p>}
                            </div>
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

                <div className={updateDetailsContentstyles.appointmentDetailContainer}>
                    <div className={globalStyleCss.header2}>
                        PWM Grade
                    </div>

                    <div className={globalStyleCss.regularBold}>
                        PWM Grade
                    </div>
                    <div className={updateDetailsContentstyles.trainingOptionContainer}>
                        <div className={updateDetailsContentstyles.trainingOptionBox}>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="radio"
                                    value="SO"
                                    checked={selectedValue === 'SO'}
                                    onChange={handleRadioChange}
                                    disabled={!pwmEnable} 
                                />
                                    Security Officer</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="radio"
                                    value="SSO"
                                    checked={selectedValue === 'SSO'}
                                    onChange={handleRadioChange}
                                    disabled={!pwmEnable2} 
                                />
                                    Senior Security Officer</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="radio"
                                    value="SS"
                                    checked={selectedValue === 'SS'}
                                    onChange={handleRadioChange}
                                    disabled={!pwmEnable3} 
                                />
                                    Security Supervisor</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="radio"
                                    value="SSS"
                                    checked={selectedValue === 'SSS'}
                                    onChange={handleRadioChange}
                                    disabled={!pwmEnable4} 
                                />
                                    Senior Security Supervisor</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="radio"
                                    value="CSO"
                                    checked={selectedValue === 'CSO'}
                                    onChange={handleRadioChange}
                                    disabled={!pwmEnable5} 
                                />
                                    Chief Security Officer</div>
                            </label>

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
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCctc"
                                    checked={checkboxes.trCctc}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Conduct Crowd and Traffic Control (CCTC)</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trCsspb"
                                    checked={checkboxes.trCsspb}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Conduct Security Screening of Person and Bag (CSSPB)</div>
                            </label>
                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trXray"
                                    checked={checkboxes.trXray}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Conduct Screening using X-ray Machine (X-RAY)</div>
                            </label>
                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}><input
                                    type="checkbox"
                                    name="trHcta"
                                    checked={checkboxes.trHcta}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Handle Counter Terrorist Activities (HCTA)</div>
                            </label>

                            <label className={updateDetailsContentstyles.checkboxes}>
                                <div className={globalStyleCss.regular}> <input
                                    type="checkbox"
                                    name="trRtt"
                                    checked={checkboxes.trRtt}
                                    onChange={handleCheckboxChange}
                                />
                                </div> <div>Recognise Terrorist Threat (RTT)</div>
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
                    <UpdateModel
                        isOpen={isModelPopupOpen}
                        onClose={handleModelOtpCancel}
                    />
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default UpdateDetailsPage;
