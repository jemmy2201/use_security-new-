"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './FirstTimeStyle.module.css';
import firstTimeContentstyles from './FirstTimeContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { DRAFT, PROCESSING, READY_FOR_ID_CARD_PRINTING, ID_CARD_READY_FOR_COLLECTION, RESUBMISSION, RESUBMITTED, COMPLETED } from '../../constant/constant';
import FooterPageLink from '../footer/FooterPage'
import HeaderPageLink from '../header/HeaderPage'





const FirstTimePage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleNewPasscardClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: users = await response.json();

            sessionStorage.setItem('users', JSON.stringify(data));

            // Process the data or store it in state/context
            console.log('data from api', data);

            // Navigate to the dashboard with query parameters or state
            router.push('/passcard');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('bookingSchedules');
        if (storedData) {
            try {
                const parsedData: bookingDetail[] = JSON.parse(storedData);
                setBookingSchedules(parsedData);

            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
    }, []);


    return (<div className={styles.container}>
        <div className={styles.content}>
            <div >
                <HeaderPageLink />
            </div>


            <div className={firstTimeContentstyles.content}>
                <div className={firstTimeContentstyles.tableHeader}>
                    <span className={firstTimeContentstyles.tableContent} style={{ textAlign: 'right' }}>
                        My Applications
                    </span>
                    <span className={firstTimeContentstyles.primaryButton}>
                        <button className={firstTimeContentstyles.primaryButtonText} style={{ textAlign: 'left' }} onClick={handleNewPasscardClick}>
                            Create new pass card
                        </button>
                    </span>
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </div>
    </div>
    );
};

export default FirstTimePage;
