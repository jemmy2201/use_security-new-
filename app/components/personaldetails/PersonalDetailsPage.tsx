"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import personalDetailsContentstyles from './PersonalDetailsContent.module.css';
import bookingDetailData from '../../types/bookingDetailDataObject'


const PersonalDetailsPage: React.FC = () => {

    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const router = useRouter();

    const [bookingDetailData, setBookingDetailData] = useState<bookingDetailData>({
        id: '',
        nric: '',
        trXray: '',
        trAvso: '',
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<users>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('users');
        if (storedData) {
            try {
                const parsedData: users = JSON.parse(storedData);
                setUsers(parsedData);
                setContactNumber(parsedData?.mobileno ?? '');
                setEmail(parsedData?.email ?? '');
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
        const storedBookingDetailData = localStorage.getItem('bookingDetailData');
        if (storedBookingDetailData) {
            try {
                const parsedBookingDetailData: bookingDetailData = JSON.parse(storedBookingDetailData);
                console.log('personal details: storedBookingDetail data', parsedBookingDetailData);
                setContactNumber(parsedBookingDetailData?.mobileno ?? '');
                setEmail(parsedBookingDetailData?.email ?? '');
            } catch (err) {
                setError('Failed to parse BookingDetail data');
            }
        } else {
            setError('No BookingDetail data found');
        }
    }, []);

    // Handlers for input changes
    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setBookingDetailData({ ...bookingDetailData, mobileno: event.target.value });
            setContactNumber(event.target.value);
            localStorage.setItem('bookingDetailData', JSON.stringify(bookingDetailData));
        }
    };

    // Handlers for input changes
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setBookingDetailData({ ...bookingDetailData, email: event.target.value });
        setEmail(event.target.value);
        localStorage.setItem('bookingDetailData', JSON.stringify(bookingDetailData));
    };


    return (

        <div className={personalDetailsContentstyles.paymentContainer}>
            <div>
                <label>Full name:</label><br></br>
                <input
                    type="text"
                    id="name"
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
                    value={contactNumber}
                    onChange={handleContactNumberChange}
                    className={personalDetailsContentstyles.mobileNoFieldBox}
                />
            </div>

            <div>
                <label>Email Address:</label><br></br>
                <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={personalDetailsContentstyles.mobileNoFieldBox}
                />
            </div>

        </div>
    );
};

export default PersonalDetailsPage;
