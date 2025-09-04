"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules, users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';
import { useFormContext } from '.././FormContext';
import 'react-toastify/dist/ReactToastify.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import { Console } from 'console';

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

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const PersonalDetailsPage: React.FC = () => {

    const { formData, setFormData } = useFormContext();
    const [users, setUsers] = useState<userInfo>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const processedValue = id === 'email' ? value.trimEnd() : value;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: processedValue,
        }));
    };

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!formData.email && !formData.mobileno) {
            const storedData = sessionStorage.getItem('users');
            if (storedData) {
                try {

                    const actionTypeValue = sessionStorage.getItem('actionTypeValue');
                    const parsedData: userInfo = JSON.parse(storedData);
                    setUsers(parsedData);
                    if (actionTypeValue && (actionTypeValue === 'Edit'
                        || actionTypeValue === 'Replace' || actionTypeValue === 'Renew')) {
                        const storedBookingSchedule = sessionStorage.getItem('bookingSchedule');
                        if (storedBookingSchedule) {
                            const parsedBookingSchedule: booking_schedules = JSON.parse(storedBookingSchedule);
                            const fileName = parsedBookingSchedule?.passid + parsedBookingSchedule.nric.slice(-4);
                            setFormData({
                                email: parsedData?.email ?? '',
                                originalMobileno: parsedData?.mobileno ?? '',
                                mobileno: parsedData?.mobileno ?? '',
                                name: parsedData?.name ?? '',
                                nric: parsedData?.nric ?? '',
                                nricText: parsedData.textNric,
                                applicationType: parsedBookingSchedule.app_type,
                                passId: parsedBookingSchedule.passid,
                                bookingId: parsedBookingSchedule.id.toString(),
                                id: parsedBookingSchedule.id.toString(),
                                actionType: actionTypeValue,
                                imageUrl: `/userdocs/img_users/${fileName}.png`,
                                cardId: parsedBookingSchedule.card_id ? parsedBookingSchedule.card_id : '',
                            });
                        }
                    } else {
                        const storedNewPassResponseData = sessionStorage.getItem('createNewPassApiResponse');
                        if (storedNewPassResponseData) {
                            const parsedNewPassData: createNewPassApiResponse = JSON.parse(storedNewPassResponseData);
                            const bookingPassId = parsedNewPassData.passId;
                            const image4char = parsedData.nric?.slice(-4) || '';
                            const fileName = bookingPassId + image4char;
                            setFormData({
                                email: parsedData?.email ?? '',
                                originalMobileno: parsedData?.mobileno ?? '',
                                mobileno: parsedData?.mobileno ?? '',
                                name: parsedData?.name ?? '',
                                nric: parsedData?.nric ?? '',
                                nricText: parsedData.textNric,
                                passId: parsedNewPassData.passId,
                                id: parsedNewPassData.recordId,
                                bookingId: parsedNewPassData.recordId,
                                actionType: actionTypeValue ? actionTypeValue : '',
                                applicationType: '1',
                                cardId: parsedNewPassData.cardId,
                                imageUrl: `/userdocs/img_users/${fileName}.png`,
                                grandTotal: parsedNewPassData.grandTotal,
                            });
                        }
                    }
                } catch (err) {
                    setError('Failed to parse user data');
                }
            } else {
                setError('No user data found');
            }
        }

    }, [formData.actionType, formData.email, formData.mobileno, setFormData]);

    return (
        <form>
            <div className={personalDetailsContentstyles.mainContainer}>
                <div className={personalDetailsContentstyles.stepContentContainer}>
                    <div className={globalStyleCss.header1}>
                        Personal details
                    </div>
                    <div className={personalDetailsContentstyles.contentBox}>
                        <div className={personalDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Full name </div>
                            <div className={personalDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.name || ''}</div></div>
                        </div>
                        <div className={personalDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>NRIC/FIN No. </div>
                            <div className={personalDetailsContentstyles.inputText}><div className={globalStyleCss.regular}>{formData.nricText || ''}</div></div>
                        </div>
                    </div>

                    <div className={personalDetailsContentstyles.contentBox}>
                        <div className={personalDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>
                                Mobile number                                 
                                {formData.errorMobileNumber && <p style={{ color: 'red' }}>{formData.errorMobileNumber}</p>}
                            </div>
                            <div className={globalStyleCss.regular}>
                                <input
                                    type="text"
                                    id="mobileno"
                                    value={formData.mobileno || ''}
                                    onChange={handleChange}
                                    className={personalDetailsContentstyles.inputBox}
                                    required placeholder="Enter your mobile number"
                                /></div>
                        </div>
                        <div className={personalDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>
                                Email Address 
                            {formData.errorEmail && <p style={{ color: 'red' }}>{formData.errorEmail}</p>}
                            </div>
                            <div className={globalStyleCss.regular}>
                                <input
                                    type="text"
                                    id="email"
                                    value={formData.email || ''}
                                    onChange={handleChange}
                                    className={personalDetailsContentstyles.inputBox}
                                    required placeholder="Enter your email"
                                /></div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PersonalDetailsPage;
