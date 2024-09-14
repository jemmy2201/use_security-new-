"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import { signIn } from 'next-auth/react';
import s from "./signin.module.scss";
import FooterPageLink from '../components/footer/FooterPage'

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginClick = async () => {
        signIn('singpass');
    };

    return (<div className={styles.container}>
        <div className={styles.overlay}>
            <div className={headerstyles.headerContainer}>
                <div className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></div>
                <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
                <div className={headerstyles.leftBox}>
                    <div className={headerstyles.contactUs}>Contact Us</div>
                    <div className={headerstyles.loginButton}><button type='button' onClick={handleLoginClick}>Log in with singpass
                        </button>
                    </div>
                </div>
            </div>

            <div className={s.bodyBox}>
                <div className={s.title}>Welcome to USE Pass Card Portal</div>

                <div className={s.serviceWrapper}>
                    <div className={s.services}>
                        <div className={s.box}>
                            <div className={s.svgBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="23" stroke="#546E7A" strokeWidth="2" />

                                    <g transform="translate(12, 12)">
                                        <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V13H20V8H4V18H12V20H4Z" fill="#546E7A" />
                                        <path d="M17 19V22H19V19H22V17H19V14H17V17H14V19H17Z" fill="#546E7A" />
                                    </g>
                                </svg>
                            </div>

                            <div className={s.boxHeader}>
                                Apply new pass card
                            </div>
                            <div className={s.boxContent}>
                                Quickly apply for your new pass card online.
                            </div>

                        </div>

                        <div className={s.box}>
                            <div className={s.svgBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="23" stroke="#546E7A" strokeWidth="2" />
                                    <g transform="translate(12, 12)">
                                        <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V13H20V8H4V18H12V20H4ZM19 24C17.7833 24 16.7208 23.6208 15.8125 22.8625C14.9042 22.1042 14.3333 21.15 14.1 20H15.65C15.8667 20.7333 16.2792 21.3333 16.8875 21.8C17.4958 22.2667 18.2 22.5 19 22.5C19.9667 22.5 20.7917 22.1583 21.475 21.475C22.1583 20.7917 22.5 19.9667 22.5 19C22.5 18.0333 22.1583 17.2083 21.475 16.525C20.7917 15.8417 19.9667 15.5 19 15.5C18.5167 15.5 18.0667 15.5875 17.65 15.7625C17.2333 15.9375 16.8667 16.1833 16.55 16.5H18V18H14V14H15.5V15.425C15.95 14.9917 16.475 14.6458 17.075 14.3875C17.675 14.1292 18.3167 14 19 14C20.3833 14 21.5625 14.4875 22.5375 15.4625C23.5125 16.4375 24 17.6167 24 19C24 20.3833 23.5125 21.5625 22.5375 22.5375C21.5625 23.5125 20.3833 24 19 24Z" fill="#546E7A" />
                                    </g>
                                </svg>

                            </div>
                            <div className={s.boxHeader}>
                                Renew pass card
                            </div>
                            <div className={s.boxContent}>
                                Renew your pass card before it expires.
                            </div>

                        </div>

                        <div className={s.box}>
                            <div className={s.svgBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="23" stroke="#546E7A" strokeWidth="2" />

                                    <g transform="translate(10, 10)">
                                        <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V13H20V8H4V18H12V20H4Z" fill="#546E7A" />
                                        <path d="M20.675 21.375L21.375 20.675L19.5 18.8V16H18.5V19.2L20.675 21.375ZM19.025 24C17.625 24 16.4375 23.5167 15.4625 22.55C14.4875 21.5833 14 20.4 14 19C14 17.6 14.4875 16.4167 15.4625 15.45C16.4375 14.4833 17.625 14 19.025 14C20.4083 14 21.5833 14.4875 22.55 15.4625C23.5167 16.4375 24 17.6167 24 19C24 20.3833 23.5167 21.5625 22.55 22.5375C21.5833 23.5125 20.4083 24 19.025 24Z" fill="#546E7A" />
                                    </g>
                                </svg>
                            </div>

                            <div className={s.boxHeader}>
                                Replace pass card
                            </div>
                            <div className={s.boxContent}>
                                Request a replacement for lost or stolen cards.

                            </div>

                        </div>

                        <div className={s.box}>
                            <div className={s.svgBox}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <circle cx="24" cy="24" r="23" stroke="#546E7A" strokeWidth="2" />

                                    <g transform="translate(12, 12)">
                                        <path d="M4 14V12H11V14H4ZM4 10V8H15V10H4ZM4 6V4H15V6H4ZM13 20V16.925L18.525 11.425C18.675 11.275 18.8417 11.1667 19.025 11.1C19.2083 11.0333 19.3917 11 19.575 11C19.775 11 19.9667 11.0375 20.15 11.1125C20.3333 11.1875 20.5 11.3 20.65 11.45L21.575 12.375C21.7083 12.525 21.8125 12.6917 21.8875 12.875C21.9625 13.0583 22 13.2417 22 13.425C22 13.6083 21.9667 13.7958 21.9 13.9875C21.8333 14.1792 21.725 14.35 21.575 14.5L16.075 20H13ZM14.5 18.5H15.45L18.475 15.45L18.025 14.975L17.55 14.525L14.5 17.55V18.5ZM18.025 14.975L17.55 14.525L18.475 15.45L18.025 14.975Z" fill="#5F6368" />
                                    </g>
                                </svg>

                            </div>

                            <div className={s.boxHeader}>
                                Update pass card
                            </div>
                            <div className={s.boxContent}>
                                Update your pass card details instantly.
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <FooterPageLink />

        </div>
    </div>
    );

};

export default HomePage;
