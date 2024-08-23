"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';
import { useFormContext } from '.././FormContext';

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
            const storedData = localStorage.getItem('users');
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
                    });

                    console.log('Parsed data:', parsedData);
                } catch (err) {
                    setError('Failed to parse user data');
                }
            } else {
                setError('No user data found');
            }
        }
    }, []); // Empty dependency array ensures this runs only once



    return (

        <div className={personalDetailsContentstyles.paymentContainer}>
            <div>
                <label>Full name:</label><br></br>
                <input
                    type="text"
                    id="name"
                    value={formData.name || ''}
                />
            </div>

            <div>
                <label>NRIC/FIN No.:</label><br></br>
                <input
                    type="text"
                    id="nric"
                    value={formData.nric || ''}
                />
            </div>

            <div>
                <label>Mobile number:</label><br></br>
                <input
                    type="number"
                    id="mobileno"
                    value={formData.mobileno || ''}
                    onChange={handleChange}
                    className={personalDetailsContentstyles.mobileNoFieldBox}
                />
            </div>

            <div>
                <label>Email Address:</label><br />
                <input
                    type="text"
                    id="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className={personalDetailsContentstyles.mobileNoFieldBox}
                />
            </div>


        </div>
    );
};

export default PersonalDetailsPage;
