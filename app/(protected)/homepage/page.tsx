"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import CircularProgress from '@mui/material/CircularProgress';

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const DefaultHomePage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);


    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {

        const fetchHomePage = async () => {
            try {
                setLoading(true);
                sessionStorage.removeItem('createNewPassApiResponse');
                sessionStorage.removeItem('users');
                sessionStorage.removeItem('bookingSchedule');
                sessionStorage.removeItem('bookingSchedules');
                sessionStorage.removeItem('actionTypeValue');
                const responseUser = await fetch('/api/myinfo');
                if (!responseUser.ok) {
                    console.log('no user detail found hence redirecting to firsttime page');
                    router.push('/firsttime');
                }
                const dataUser: userInfo = await responseUser.json();
                sessionStorage.setItem('users', JSON.stringify(dataUser));
                console.log('data from api', dataUser);

                const response = await fetch('/api/dashboard');
                if (!response.ok && response.status === 401) {
                    router.push('/signin');
                    throw new Error('token expired in stripe session');
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
        fetchHomePage();

    }, [router]);

    return (
        <div >
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: "url('images/logo_pdf.png')",
                        backgroundSize: "auto",
                        backgroundPosition: "center",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </div>

            )}
        </div>
    );
};

export default DefaultHomePage;
