"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';



const PersonalDetailsPage: React.FC = () => {

    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const router = useRouter();

    // State variables to store the input values
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');


    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<users>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Retrieve data from localStorage
        const storedData = localStorage.getItem('users');
        if (storedData) {
            try {
                const parsedData: users = JSON.parse(storedData);
                setUsers(parsedData);
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
    }, []);

    // Handlers for input changes
    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactNumber(event.target.value);
    };

    return (

        <div className={personalDetailsContentstyles.paymentContainer}>
            <div>
                <label>Full name:</label><br></br>
                <input
                    type="text"
                    id="contactNumber"
                    value={users?.name}
                />
            </div>

            <div>
                <label>NRIC/FIN No.:</label><br></br>
                <input
                    type="text"
                    id="nric"
                    value={users?.nric ?? ''}
                />
            </div>

            <div>
                <label>Mobile number:</label><br></br>
                <input
                    type="text"
                    id="contactNumber"
                    value={users?.mobileno ?? ''}
                    onChange={handleContactNumberChange}
                />
            </div>

            <div>
                <label>Email Address:</label><br></br>
                <input
                    type="text"
                    id="email"
                    value={users?.email ?? ''}
                    className={personalDetailsContentstyles.stepContentEmailLabel}
                />
            </div>

        </div>
    );
};

export default PersonalDetailsPage;
