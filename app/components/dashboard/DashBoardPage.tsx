"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashBoardStyle.module.css';
import dashBoardContentstyles from './DashBoardContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { DRAFT, PROCESSING, READY_FOR_ID_CARD_PRINTING, ID_CARD_READY_FOR_COLLECTION, RESUBMISSION, RESUBMITTED, COMPLETED } from '../../constant/constant';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import encryptDecrypt from '@/app/utils/encryptDecrypt';

const cardTypeMap: { [key: string]: string } = {
    [SO_APP]: 'Security Officer (SO)',
    [AVSO_APP]: 'Aviation Security Officer',
    [PI_APP]: 'Personal Investigator',
};

const appTypeMap: { [key: string]: string } = {
    [NEW]: 'New',
    [REPLACEMENT]: 'Replace',
    [RENEWAL]: 'Renew',
};

const statusTypeMap: { [key: string]: string } = {
    [DRAFT]: 'DRAFT',
    [PROCESSING]: 'PROCESSING',
    [READY_FOR_ID_CARD_PRINTING]: 'READY_FOR_ID_CARD_PRINTING',
    [ID_CARD_READY_FOR_COLLECTION]: 'ID_CARD_READY_FOR_COLLECTION',
    [RESUBMISSION]: 'RESUBMISSION',
    [RESUBMITTED]: 'RESUBMITTED',
    [COMPLETED]: 'COMPLETED',
};


const DashBoardPage: React.FC = () => {

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

            localStorage.setItem('users', JSON.stringify(data));

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

    const handleEditPasscardClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: users = await response.json();
            localStorage.setItem('users', JSON.stringify(data));
            // Process the data or store it in state/context
            console.log('data from api', data);
            
            const responseBookingSchedule = await fetch('/api/getBookingSchedule');
            if (!responseBookingSchedule.ok) {
                throw new Error('Network response was not ok');
            }
            const dataBookingSchedule: users = await responseBookingSchedule.json();
            localStorage.setItem('bookingSchedule', JSON.stringify(dataBookingSchedule));
            // Process the data or store it in state/context
            console.log('booking data from api', dataBookingSchedule);

            // Navigate to the dashboard with query parameters or state
            router.push('/passcard');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Retrieve data from localStorage
        const storedData = localStorage.getItem('bookingSchedules');
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

            <div className={dashBoardContentstyles.content}>

                <div className={dashBoardContentstyles.tableHeader}>
                    <span className={dashBoardContentstyles.tableContent} style={{ textAlign: 'right' }}>
                        <h1>My applications</h1>
                    </span>
                    <span className={dashBoardContentstyles.primaryButton}>
                        <button className={dashBoardContentstyles.primaryButtonText} style={{ textAlign: 'left' }} onClick={handleNewPasscardClick}>
                            <h2>Create new pass card</h2>
                        </button>
                    </span>
                </div>


                <table className={dashBoardContentstyles.dashBoardTable}>
                    <thead className={dashBoardContentstyles.dashBoardTableHeader}>


                        <tr>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Application type</h2></th>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Pass card type</h2></th>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Grade</h2></th>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Collection date</h2></th>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Application Status</h2></th>
                            <th className={dashBoardContentstyles.dashBoardTableHeaderContent}><h2>Actions</h2></th>
                        </tr>
                    </thead>
                    <tbody className={dashBoardContentstyles.dashBoardTableHeader}>
                        {bookingSchedules.map((booking) => (
                            <tr>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.app_type}>{appTypeMap[booking.app_type || ''] || 'Unknown'}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.card_id}>{cardTypeMap[booking.card_id || ''] || 'Unknown'}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.grade_id}>{booking.grade_id}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.trans_date}>{booking.appointment_date}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.TR_AVSO}>{booking.TR_AVSO}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.Status_app}>{statusTypeMap[booking.Status_app || ''] || 'Unknown'}</td>
                                <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>
                                    <a href="/edit" onClick={(e) => {
                                        e.preventDefault(); handleEditPasscardClick(booking.id);
                                    }}
                                        style={{ color: 'blue', marginRight: '10px' }}>
                                        Continue
                                    </a>
                                    <a href="/edit" onClick={(e) => {
                                        e.preventDefault(); handleNewPasscardClick();
                                    }}
                                        style={{ color: 'blue', marginRight: '0px' }}>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div >
                <FooterPageLink />
            </div>
        </div>
    </div>
    );
};

export default DashBoardPage;
