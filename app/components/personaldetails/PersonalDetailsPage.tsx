"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';
import { useFormContext } from '.././FormContext';
import { booking_schedules } from '@prisma/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import globalStyleCss from '../globalstyle/Global.module.css';

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
        if (!formData.email && !formData.mobileno) {
            const storedData = sessionStorage.getItem('users');
            if (storedData) {
                try {
                    const parsedData: users = JSON.parse(storedData);
                    setUsers(parsedData);
                    // Initialize formData only if it's empty
                    setFormData({
                        email: parsedData?.email ?? '',
                        originalMobileno: parsedData?.mobileno ?? '',
                        mobileno: parsedData?.mobileno ?? '',
                        name: parsedData?.name ?? '',
                        nric: parsedData?.nric ?? '',
                        nricText: 'SXXXXXXXA',
                    });

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

            <div className={personalDetailsContentstyles.stepContentContainer}>
                <div className={personalDetailsContentstyles.headingText}>
                    Personal details
                </div>
                <div className={personalDetailsContentstyles.contentBox}>
                    <div className={personalDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>Full name </div>
                        <div className={globalStyleCss.regular}>{formData.name || ''}</div>
                    </div>
                    <div className={personalDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>NRIC/FIN No. </div>
                        <div className={globalStyleCss.regular}>{formData.nricText || ''}</div>
                    </div>
                </div>

                <div className={personalDetailsContentstyles.contentBox}>
                    <div className={personalDetailsContentstyles.item}>
                        <div className={globalStyleCss.regularBold}>Mobile number: </div>
                        <div className={globalStyleCss.regular}>                                <input
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
                        <div className={globalStyleCss.regular}>                               <input
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

        </form>
    );
};

export default PersonalDetailsPage;
