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
}

const PersonalDetailsPage: React.FC = () => {

    const { formData, setFormData } = useFormContext();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const [users, setUsers] = useState<users>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('PersonalDetailsPage: Action Type ', formData.actionType);
        if (!formData.email && !formData.mobileno) {
            const storedData = sessionStorage.getItem('users');
            if (storedData) {
                try {

                    const actionTypeValue = sessionStorage.getItem('actionTypeValue');
                    console.log('Action type value:', typeof actionTypeValue);
                    const parsedData: users = JSON.parse(storedData);
                    setUsers(parsedData);
                    if (!!actionTypeValue && (actionTypeValue === 'Edit' 
                                || actionTypeValue === 'Replace' || actionTypeValue === 'Renew')) {
                        const storedBookingSchedule = sessionStorage.getItem('bookingSchedule');
                        console.log('storedBookingSchedule:', storedBookingSchedule);
                        if (storedBookingSchedule) {
                            const parsedBookingSchedule: booking_schedules = JSON.parse(storedBookingSchedule);
                            console.log('parsedBookingSchedule:', parsedBookingSchedule);
                            
                            setFormData({
                                email: parsedData?.email ?? '',
                                originalMobileno: parsedData?.mobileno ?? '',
                                mobileno: parsedData?.mobileno ?? '',
                                name: parsedData?.name ?? '',
                                nric: parsedData?.nric ?? '',
                                nricText: 'SXXXXXXXA',
                                applicationType: parsedBookingSchedule.app_type,
                                passId: parsedBookingSchedule.passid,
                                bookingId: parsedBookingSchedule.id.toString(),
                                id: parsedBookingSchedule.id.toString(),
                                actionType: actionTypeValue,
                                cardId: parsedBookingSchedule.card_id ? parsedBookingSchedule.card_id : '',
                            });
                        }
                    } else {
                        const storedNewPassResponseData = sessionStorage.getItem('createNewPassApiResponse');
                        if (storedNewPassResponseData) {
                            const parsedNewPassData: createNewPassApiResponse = JSON.parse(storedNewPassResponseData);
                            setFormData({
                                email: parsedData?.email ?? '',
                                originalMobileno: parsedData?.mobileno ?? '',
                                mobileno: parsedData?.mobileno ?? '',
                                name: parsedData?.name ?? '',
                                nric: parsedData?.nric ?? '',
                                nricText: 'SXXXXXXXA',
                                passId: parsedNewPassData.passId,
                                id: parsedNewPassData.recordId,
                                bookingId: parsedNewPassData.recordId,
                                actionType: actionTypeValue ? actionTypeValue : '',
                                applicationType: '1',
                                cardId: parsedNewPassData.cardId,
                            });
                        }
                    }


                    console.log('Parsed data:', parsedData);

                } catch (err) {
                    setError('Failed to parse user data');
                }
            } else {
                setError('No user data found');
            }
        }

    }, []);

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
                            <div className={globalStyleCss.regularBold}>Mobile number: </div>
                            <div className={globalStyleCss.regular}>
                                <input
                                    type="number"
                                    id="mobileno"
                                    value={formData.mobileno || ''}
                                    onChange={handleChange}
                                    className={personalDetailsContentstyles.inputBox}
                                    required placeholder="Enter your mobile number"
                                /></div>
                        </div>
                        <div className={personalDetailsContentstyles.item}>
                            <div className={globalStyleCss.regularBold}>Email Address. </div>
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
