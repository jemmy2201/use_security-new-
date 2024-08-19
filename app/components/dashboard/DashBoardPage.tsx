"use client";

import React, { useEffect, useState } from 'react';
import encryptDecrypt from '../../utils/encryptDecrypt';
import styles from './DashBoardStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import dashBoardContentstyles from './DashBoardContent.module.css';
//import bookingDetail from '../../types/BookingDetail';
import { booking_schedules as bookingDetail } from '@prisma/client';

const DashBoardPage: React.FC = () => {


    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);

    const [error, setError] = useState<string | null>(null);

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
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={headerstyles.header}>
                    <div className={headerstyles.logo}>
                        <img src="/images/logo.png" alt="Logo" />
                    </div>
                    <div className={headerstyles.headercontainer}>
                        <span className={headerstyles.contactus}>
                            <p>Contact Us</p>
                        </span>
                        <span className={headerstyles.logoutButton}>
                            <button>Log out</button>
                        </span>
                    </div>
                </div>

                <div className={dashBoardContentstyles.content}>
                    <table className={dashBoardContentstyles.tableHeader}>
                        <thead>
                            <tr>
                                <th className={dashBoardContentstyles.tableContent} style={{ textAlign: 'right' }}>

                                    My Applications

                                </th>
                                <th className={dashBoardContentstyles.primaryButton}>
                                    <button className={dashBoardContentstyles.primaryButtonText} style={{ textAlign: 'left' }}>
                                        Create new pass card
                                    </button>
                                </th>
                            </tr>
                        </thead>

                    </table>

                    <table className={dashBoardContentstyles.dashBoardTable}>
                        <thead className={dashBoardContentstyles.dashBoardTableHeader}>


                            <tr>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Application type</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Pass card type</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Grade</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Application date</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Training Status</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Application Status</th>
                                <th className={dashBoardContentstyles.dashBoardTableHeaderContent}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingSchedules.map((booking) => (
                                <tr>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.app_type}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.card_id}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.grade_id}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.trans_date}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.TR_AVSO}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>{booking.Status_app}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>Edit</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className={footerstyles.footer}>
                    <div className={footerstyles.cta}>
                        <div className={footerstyles.text}>Privacy Notice</div>
                        <div className={footerstyles.text}>|</div>
                        <div className={footerstyles.text}>Terms & Conditions</div>
                        <div className={footerstyles.text}>|</div>
                        <div className={footerstyles.text}>FAQs</div>
                    </div>
                    <div className={footerstyles.copyright}>
                        <div className={footerstyles.text}>Copyright © 2024 Union of Security Employees (USE). All rights reserved.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default DashBoardPage;
