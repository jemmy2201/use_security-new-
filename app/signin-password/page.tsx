"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import { signIn } from 'next-auth/react';
import s from "./signin.module.scss";
import FooterPageLink from '../components/footer/FooterPage'
import globalStyleCss from '../components/globalstyle/Global.module.css';
import Link from 'next/link';
import Image from 'next/image';

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [startDateError, setStartDateError] = useState<string>("");
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Build the form data
        const formData = {
            username,
            password,
        };

        try {
            // Send a POST request to the API
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
                router.push('/terms');
            } else {

                setStartDateError(result.message);

                console.error(result.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.overlay}>
                <div className={headerstyles.headerContainer}>
                    <div className={headerstyles.logo}><Image src="/images/logo.png" alt="Logo" width={55} height={58} /></div>
                    <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
                    <div className={headerstyles.leftBox}>
                        <div className={headerstyles.phoneSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M20.7031 21C18.6197 21 16.5614 20.5458 14.5281 19.6375C12.4947 18.7292 10.6447 17.4417 8.97808 15.775C7.31142 14.1083 6.02392 12.2583 5.11558 10.225C4.20725 8.19167 3.75308 6.13333 3.75308 4.05C3.75308 3.75 3.85308 3.5 4.05308 3.3C4.25308 3.1 4.50308 3 4.80308 3H8.85308C9.08642 3 9.29475 3.07917 9.47808 3.2375C9.66142 3.39583 9.76975 3.58333 9.80308 3.8L10.4531 7.3C10.4864 7.56667 10.4781 7.79167 10.4281 7.975C10.3781 8.15833 10.2864 8.31667 10.1531 8.45L7.72808 10.9C8.06142 11.5167 8.45725 12.1125 8.91558 12.6875C9.37392 13.2625 9.87808 13.8167 10.4281 14.35C10.9447 14.8667 11.4864 15.3458 12.0531 15.7875C12.6197 16.2292 13.2197 16.6333 13.8531 17L16.2031 14.65C16.3531 14.5 16.5489 14.3875 16.7906 14.3125C17.0322 14.2375 17.2697 14.2167 17.5031 14.25L20.9531 14.95C21.1864 15.0167 21.3781 15.1375 21.5281 15.3125C21.6781 15.4875 21.7531 15.6833 21.7531 15.9V19.95C21.7531 20.25 21.6531 20.5 21.4531 20.7C21.2531 20.9 21.0031 21 20.7031 21ZM6.77808 9L8.42808 7.35L8.00308 5H5.77808C5.86142 5.68333 5.97808 6.35833 6.12808 7.025C6.27808 7.69167 6.49475 8.35 6.77808 9ZM15.7281 17.95C16.3781 18.2333 17.0406 18.4583 17.7156 18.625C18.3906 18.7917 19.0697 18.9 19.7531 18.95V16.75L17.4031 16.275L15.7281 17.95Z" fill="white" />
                            </svg>
                        </div>
                        <div className={headerstyles.contactUs}><Link href="/contactus">Contact Us</Link>

                        </div>


                    </div>
                </div>

                <div className={s.bodyBox}>
                    <div className={s.title}>Welcome to USE ID Card Portal </div>
                    <form onSubmit={handleSubmit}>

                        <div className={s.loginBox}><label htmlFor="username">Username:&nbsp;</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ color: 'black' }}
                            />  </div>
                        <div className={s.loginBox}>
                            <label htmlFor="password">Password:&nbsp;</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ color: 'black' }}
                            /> </div>
                        <div className={s.loginBox}>
                            <button type="submit" className={headerstyles.loginButton}>
                                <div className={globalStyleCss.primaryButton}>Log in</div>
                            </button>
                            {startDateError && <p style={{ color: 'red' }}>{startDateError}</p>}

                        </div>
                    </form>

                    <div className={s.serviceWrapper}>
                        <div className={s.services}>
                            <div className={s.box}>
                                <div className={s.svgBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="23" stroke="#546E7A" stroke-width="2" />
                                        <image href="/images/new.jpg" x="12" y="12" height="24" width="24" clipPath="circle(22px at 20px 20px)" />
                                    </svg>
                                </div>

                                <div className={s.boxHeader}>
                                    Apply New ID Card
                                </div>
                                <div className={s.boxContent}>
                                    Application For New ID Card
                                </div>

                            </div>

                            <div className={s.box}>
                                <div className={s.svgBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="23" stroke="#546E7A" stroke-width="2" />
                                        <image href="/images/renew.jpg" x="12" y="12" height="24" width="24" clipPath="circle(22px at 20px 20px)" />
                                    </svg>

                                </div>
                                <div className={s.boxHeader}>
                                    Renew ID Card
                                </div>
                                <div className={s.boxContent}>
                                    Application To Renew ID Card
                                    <br></br>For soon to expire ID
                                </div>

                            </div>

                            <div className={s.box}>
                                <div className={s.svgBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="23" stroke="#546E7A" stroke-width="2" />
                                        <image href="/images/replace.jpg" x="12" y="12" height="24" width="24" clipPath="circle(22px at 20px 20px)" />
                                    </svg>
                                </div>

                                <div className={s.boxHeader}>
                                    Replacement ID Card
                                </div>
                                <div className={s.boxContent}>
                                    Application For Replacement or Lost ID Card
                                </div>
                            </div>

                            <div className={s.box}>
                                <div className={s.svgBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="23" stroke="#546E7A" stroke-width="2" />
                                        <image href="/images/edit.jpg" x="14" y="14" height="24" width="24" clipPath="circle(22px at 20px 20px)" />
                                    </svg>

                                </div>

                                <div className={s.boxHeader}>
                                    Update Details
                                </div>
                                <div className={s.boxContent}>
                                    Update New PWM Grade and Courses Attained
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
