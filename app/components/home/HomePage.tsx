"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';

//import bookingDetail from '../../types/BookingDetail';
import { booking_schedules as bookingDetail } from '@prisma/client';

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginClick = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/login');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: bookingDetail[] = await response.json();

            if (data.length === 0) {
                console.log('No booking details found.');
                // Handle the case when there are no booking details
                router.push('/firsttime');
            } else {
                localStorage.setItem('bookingSchedules', JSON.stringify(data));
                // Process the data or store it in state/context
                console.log('data from api', data);
                // Navigate to the dashboard with query parameters or state
                router.push('/dashboard');
            }



        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    return (<div className={styles.container}>
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={headerstyles.header}>
                    <div className={headerstyles.leftHeader}>
                        <span className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></span>
                        <span className={headerstyles.useText}><h1>Union of Security Employees (USE)</h1></span>
                    </div>
                    <div className={headerstyles.headercontainer}>
                        <span className={headerstyles.contactus}>
                            <h1>Contact Us</h1>
                        </span>
                        <span className={headerstyles.loginButton}>
                            <button onClick={handleLoginClick}><h2>Log in with singpass</h2></button>
                        </span>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.bodyp}><h1>Welcome to USE Pass Card Portal</h1></div>
                    <div className={styles.services}>
                        <div className={styles.services2}>
                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    <h1>Apply new pass card</h1>
                                </div>
                                <div className={styles.servicesblockbody}>
                                    <h2>Quickly apply for your new pass card online.</h2>
                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    <h2>Find out more</h2>
                                </div>
                            </span>
                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    <h1>Replace pass card</h1>
                                </div>
                                <div className={styles.servicesblockbody}>
                                    <h2>For lost or stolen cards, request for a replacement. </h2>

                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    <h2>Find out more</h2>
                                </div>
                            </span>
                        </div>
                        <div className={styles.services2}>
                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    <h1>Renew pass card</h1>
                                </div>
                                <div className={styles.servicesblockbody}>
                                    <h2>Renew your pass card before it expires.</h2>
                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    <h2>Find out more</h2>
                                </div>
                            </span>

                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    <h1>Update pass card</h1>
                                </div>
                                <div className={styles.servicesblockbody}>
                                    <h2>Update your pass card details instantly.</h2>                  
                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    <h2>  Find out more</h2>
                                </div>
                            </span>
                        </div>
                    </div>
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

export default HomePage;
