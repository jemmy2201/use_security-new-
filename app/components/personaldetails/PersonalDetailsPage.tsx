"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';
import { useFormContext } from '.././FormContext';
import { booking_schedules } from '@prisma/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

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
            <div className={personalDetailsContentstyles.paymentContainer}>
                <div className={personalDetailsContentstyles.applicantDetails}>
                    <div className={personalDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={personalDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>Personal details</h1>
                        </div>

                    </div>

                    <div className={personalDetailsContentstyles.flexContainer}>
                        <span>
                            <div className={personalDetailsContentstyles.paymentContainerAmtHeader}>
                                <div className={personalDetailsContentstyles.optionsHeaderText}>
                                    <label><h1>Full name:</h1></label>

                                </div>
                                <div className={personalDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name || ''}
                                    />
                                </div>
                            </div>
                            <div className={personalDetailsContentstyles.spanLeftGap}>

                            </div>
                            <div className={personalDetailsContentstyles.paymentContainerAmtHeader}>
                                <div className={personalDetailsContentstyles.optionsHeaderText}>
                                    <label><h1>Mobile number:</h1></label>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        id="mobileno"
                                        value={formData.mobileno || ''}
                                        onChange={handleChange}
                                        className={personalDetailsContentstyles.mobileNoFieldBox}
                                        required placeholder="Enter your mobile number"
                                    />
                                </div>
                            </div>

                        </span>
                        <span>
                            <div className={personalDetailsContentstyles.paymentContainerAmtHeader}>
                                <div className={personalDetailsContentstyles.optionsHeaderText}>
                                    <label><h1>NRIC/FIN No.:</h1></label>
                                </div>
                                <div className={personalDetailsContentstyles.personalDetailsNricText}>
                                    <input
                                        type="text"
                                        id="nric"
                                        value={formData.nricText || ''}
                                    />
                                </div>
                            </div>
                            <div className={personalDetailsContentstyles.spanLeftGap}>

                            </div>
                            <div className={personalDetailsContentstyles.paymentContainerAmtHeader}>
                                <div className={personalDetailsContentstyles.optionsHeaderText}>
                                    <label><h1>Email Address:</h1></label>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        id="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className={personalDetailsContentstyles.mobileNoFieldBox}
                                        required placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PersonalDetailsPage;
