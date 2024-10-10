"use client";

import React from 'react';
import headerstyles from './HeaderStyle.module.css';
import { logout } from '@/actions/auth';
import globalStyleCss from '../globalstyle/Global.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HeaderPage: React.FC = () => {

    const router = useRouter();

    const handleClick = () => {
        router.push('/homepage');
    };

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('createNewPassApiResponse');
            sessionStorage.removeItem('users');
            sessionStorage.removeItem('bookingSchedule');
            sessionStorage.removeItem('bookingSchedules');
            sessionStorage.removeItem('actionTypeValue');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (

        <div className={headerstyles.siteHeaderContainer}>
            <div className={headerstyles.logo} onClick={handleClick} style={{ cursor: 'pointer' }}><img src="/images/logo.png" alt="Logo" /></div>
            <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
            <div className={headerstyles.leftBox}>
                <div className={headerstyles.contactUs}>
                    <Link href='contactuslogin'>
                        <div className={globalStyleCss.buttonText}>
                            Contact Us
                        </div>
                    </Link>
                </div>
                <div className={headerstyles.loginButton}>
                    <button type='button' onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>

    );
};

export default HeaderPage;




