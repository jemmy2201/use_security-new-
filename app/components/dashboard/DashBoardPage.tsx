"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashBoardStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import dashBoardContentstyles from './DashBoardContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { DRAFT, PROCESSING, READY_FOR_ID_CARD_PRINTING,ID_CARD_READY_FOR_COLLECTION,RESUBMISSION,RESUBMITTED,COMPLETED } from '../../constant/constant';


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
                                    <button className={dashBoardContentstyles.primaryButtonText} style={{ textAlign: 'left' }} onClick={handleNewPasscardClick}>
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
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.app_type}>{appTypeMap[booking.app_type || ''] || 'Unknown'}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.card_id}>{cardTypeMap[booking.card_id || ''] || 'Unknown'}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.grade_id}>{booking.grade_id}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.trans_date}>{booking.trans_date}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.TR_AVSO}>{booking.TR_AVSO}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData} key={booking.Status_app}>{statusTypeMap[booking.Status_app || ''] || 'Unknown'}</td>
                                    <td className={dashBoardContentstyles.dashBoardTableHeaderContentData}>
                                        <a href="/edit" onClick={(e) => {
                                            e.preventDefault(); handleNewPasscardClick();
                                        }}
                                            style={{ color: 'blue', marginRight: '10px' }}>
                                            Edit
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
