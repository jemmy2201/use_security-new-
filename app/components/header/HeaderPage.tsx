"use client";

import React from 'react';
import headerstyles from './HeaderStyle.module.css';
import { logout } from '@/actions/auth';


const HeaderPage: React.FC = () => {

    const handleLogout = async () => {
        try {
            await logout();
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('createNewPassApiResponse');
            sessionStorage.removeItem('users');
            sessionStorage.removeItem('bookingSchedule');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (

        <div className={headerstyles.headerContainer}>
            <div className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></div>
            <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
            <div className={headerstyles.leftBox}>
                <div className={headerstyles.contactUs}>Contact Us</div>
                <div className={headerstyles.loginButton}>
                    <button type='button' onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>

    );
};

export default HeaderPage;




