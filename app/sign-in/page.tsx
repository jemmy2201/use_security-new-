"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import { signIn } from 'next-auth/react';

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginClick = async () => {
        signIn('singpass'); 
    };

    return (<div className={styles.container}>
        <div className={styles.overlay}>
            <div className={styles.content}>
                <div className={headerstyles.header}>
                    <div className={headerstyles.leftHeader}>
                        <span className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></span>
                        <span className={headerstyles.useText}><p>Union of Security Employees (USE)</p></span>
                    </div>
                    <div className={headerstyles.headercontainer}>
                        <span className={headerstyles.contactus}>
                            <p>Contact Us</p>
                        </span>
                        <span className={headerstyles.loginButton}>
                            <button onClick={handleLoginClick}>Log in with singpass</button>
                        </span>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.bodyp}>USE Pass Card Portal</div>
                    <div className={styles.services}>
                        <div className={styles.services2}>
                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    Apply new pass card
                                </div>
                                <div className={styles.servicesblockbody}>
                                    Quickly apply for your new pass card online.
                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    Find out more
                                </div>
                            </span>
                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    Replace pass card
                                </div>
                                <div className={styles.servicesblockbody}>
                                    For lost or stolen cards, request for a replacement.                    </div>
                                <div className={styles.servicesfindoutmore}>
                                    Find out more
                                </div>
                            </span>
                        </div>
                        <div className={styles.services2}>

                        <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    Renew pass card
                                </div>
                                <div className={styles.servicesblockbody}>
                                    Renew your pass card before it expires.
                                </div>
                                <div className={styles.servicesfindoutmore}>
                                    Find out more
                                </div>
                            </span>

                            <span className={styles.servicesblock}>
                                <div className={styles.servicesblockheader}>
                                    Update pass card
                                </div>
                                <div className={styles.servicesblockbody}>
                                    Update your pass card details instantly.                    </div>
                                <div className={styles.servicesfindoutmore}>
                                    Find out more
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
