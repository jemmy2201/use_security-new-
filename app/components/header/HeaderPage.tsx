"use client";

import React, { useEffect, useState } from 'react';
import headerstyles from './HeaderStyle.module.css';
import { logout } from '@/actions/auth';
import globalStyleCss from '../globalstyle/Global.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LogoutPopup from './LogoutPopup'
import CircularProgress from '@mui/material/CircularProgress';

const HeaderPage: React.FC = () => {

    const router = useRouter();
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState<boolean>(false); // State for OTP popup
    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = () => {
        router.push('/homepage');
    };

    const handleContinue = () => {
        setIsLogoutPopupOpen(false);
    };
    const handleCancelCancel = async () => {
        setIsLogoutPopupOpen(false);
        try {
            setLoading(true);
            await logout();
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('createNewPassApiResponse');
            sessionStorage.removeItem('users');
            sessionStorage.removeItem('bookingSchedule');
            sessionStorage.removeItem('bookingSchedules');
            sessionStorage.removeItem('actionTypeValue');
        } catch (error) {
            setLoading(false);
            console.error('Logout failed', error);
        } finally {
            // setLoading(false);
        }
    };


    const handleLogout = async () => {
        const actionTypeValue = sessionStorage.getItem('actionTypeValue');
        if (actionTypeValue) {
            setIsLogoutPopupOpen(true);
        } else {
            try {
                setLoading(true);
                await logout();
                sessionStorage.removeItem('id_token');
                sessionStorage.removeItem('createNewPassApiResponse');
                sessionStorage.removeItem('users');
                sessionStorage.removeItem('bookingSchedule');
                sessionStorage.removeItem('bookingSchedules');
                sessionStorage.removeItem('actionTypeValue');
            } catch (error) {
                setLoading(false);
                console.error('Logout failed', error);
            } finally {
                // setLoading(false);
            }
        }
    };

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            await logout();
            sessionStorage.removeItem('id_token');
            sessionStorage.removeItem('createNewPassApiResponse');
            sessionStorage.removeItem('users');
            sessionStorage.removeItem('bookingSchedule');
            sessionStorage.removeItem('bookingSchedules');
            sessionStorage.removeItem('actionTypeValue');
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (

        <div className={headerstyles.siteHeaderContainer}>
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}
            <LogoutPopup
                isOpen={isLogoutPopupOpen}
                onClose={handleCancelCancel}
                onContinue={handleContinue}
            />
            <div className={headerstyles.logo} onClick={handleClick} style={{ cursor: 'pointer' }}><Image src="/images/logo.png" alt="Logo" width={55} height={58} /></div>
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




