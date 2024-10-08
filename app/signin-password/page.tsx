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
                    <div className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></div>
                    <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
                    <div className={headerstyles.leftBox}>
                        <div className={headerstyles.phoneSvg}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M20.7031 21C18.6197 21 16.5614 20.5458 14.5281 19.6375C12.4947 18.7292 10.6447 17.4417 8.97808 15.775C7.31142 14.1083 6.02392 12.2583 5.11558 10.225C4.20725 8.19167 3.75308 6.13333 3.75308 4.05C3.75308 3.75 3.85308 3.5 4.05308 3.3C4.25308 3.1 4.50308 3 4.80308 3H8.85308C9.08642 3 9.29475 3.07917 9.47808 3.2375C9.66142 3.39583 9.76975 3.58333 9.80308 3.8L10.4531 7.3C10.4864 7.56667 10.4781 7.79167 10.4281 7.975C10.3781 8.15833 10.2864 8.31667 10.1531 8.45L7.72808 10.9C8.06142 11.5167 8.45725 12.1125 8.91558 12.6875C9.37392 13.2625 9.87808 13.8167 10.4281 14.35C10.9447 14.8667 11.4864 15.3458 12.0531 15.7875C12.6197 16.2292 13.2197 16.6333 13.8531 17L16.2031 14.65C16.3531 14.5 16.5489 14.3875 16.7906 14.3125C17.0322 14.2375 17.2697 14.2167 17.5031 14.25L20.9531 14.95C21.1864 15.0167 21.3781 15.1375 21.5281 15.3125C21.6781 15.4875 21.7531 15.6833 21.7531 15.9V19.95C21.7531 20.25 21.6531 20.5 21.4531 20.7C21.2531 20.9 21.0031 21 20.7031 21ZM6.77808 9L8.42808 7.35L8.00308 5H5.77808C5.86142 5.68333 5.97808 6.35833 6.12808 7.025C6.27808 7.69167 6.49475 8.35 6.77808 9ZM15.7281 17.95C16.3781 18.2333 17.0406 18.4583 17.7156 18.625C18.3906 18.7917 19.0697 18.9 19.7531 18.95V16.75L17.4031 16.275L15.7281 17.95Z" fill="white" />
                            </svg>
                        </div>
                        <div className={headerstyles.contactUs}><Link href="/contactus">Contact Us</Link>
                        
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className={headerstyles.loginButton}>
                                
                                <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ color: 'black', width: '25%', padding: '2px', boxSizing: 'border-box' }}
                                    required
                                />
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ color: 'black', width: '25%', padding: '2px', boxSizing: 'border-box' }}
                                    required
                                />
                                <button type="submit">
                                    <div className={globalStyleCss.primaryButton}>Log in</div>
                                </button>
                                
                            </div>
                        </form>
                        {startDateError && <p style={{ color: 'red' }}>{startDateError}</p>}
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
