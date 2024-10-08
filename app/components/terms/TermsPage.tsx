"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import termsContentstyles from './TermsContent.module.scss';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { booking_schedules as bookingDetail } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';
import { logout } from '@/actions/auth';
import CircularProgress from '@mui/material/CircularProgress';

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const TermsPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [text, setText] = useState<string>(
        `1.1 This is an Agreement (“Terms of Use”) between you and the UNION OF SECURITY EMPLOYEES("we", “us” and/or “USE”) for the use of our web portal https://www.iduse.org.sg ("Web Portal") and mobile applications (“Apps”), owned and operated by us, and their related services and features (the Website and the Apps shall be collectively referred to as “USE Web Portal”). By using and accessing the USE Web Portal, you conclude a legally binding agreement with us.

1.2  We may update these Terms of Use from time to time by posting a revised version on the USE Web Portal. We will not send an individual notice to you. Any amended Terms of Use shall replace all previous versions of the same.

1.3  By using the USE Web Portal, you agree to comply with the Terms of Use, including any revisions that we may make to the Terms of Use. If you do not agree to the Terms of Use and/or to the amendments, you should immediately cease the use of any of the services on the USE Web Portal.
`);

    const router = useRouter();

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxToggle = () => {
        setIsChecked(!isChecked);
    };

    const onCancel = async () => {
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

    const onContinue = async () => {

        if (!isChecked) {
            setErrorMessage('Please accept the terms and conditions of use.');
        } else {
            try {
                setLoading(true);
                const responseUser = await fetch('/api/myinfo');
                if (!responseUser.ok) {
                    console.log('no user detail found hence redirecting to firsttime page');
                    router.push('/firsttime');
                }
                const dataUser: userInfo = await responseUser.json();

                sessionStorage.setItem('users', JSON.stringify(dataUser));
                // Process the data or store it in state/context
                console.log('data from api', dataUser);


                const response = await fetch('/api/dashboard');
                if (!response.ok && response.status === 401) {
                    router.push('/signin');
                    throw new Error('token expired in stripe session');
                }
                const data: bookingDetail[] = await response.json();
                console.log('booking card list: ', data.length);
                if (data.length === 0) {
                    console.log('No booking details found.');
                    router.push('/firsttime');
                } else {
                    sessionStorage.setItem('bookingSchedules', JSON.stringify(data));
                    console.log('data from api', data);
                    router.push('/dashboard');
                }
            } catch (err) {
                setErrorMessage('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        }

    };


    return (

        <div style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background:'#F5F6F7' }}>
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}
            <div >
                <HeaderPageLink />
            </div>
            <div className={termsContentstyles.mainContainer}>
                <div className={termsContentstyles.termsContainer}>
                    <div className={globalStyleCss.header1}>
                        Terms & Conditions of Use
                    </div>

                    {errorMessage && (
                        <>
                            <div className={globalStyleCss.errorMessageContainer}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1301_406)">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 17C11.45 17 11 16.55 11 16C11 15.45 11.45 15 12 15C12.55 15 13 15.45 13 16C13 16.55 12.55 17 12 17ZM13 12C13 12.55 12.55 13 12 13C11.45 13 11 12.55 11 12V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V12Z" fill="#CC0C00" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1301_406">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg><span className={globalStyleCss.regular}>{errorMessage} </span>
                            </div>

                        </>
                    )}
                    <div className={termsContentstyles.bodyContainer}>
                        <div className={globalStyleCss.header2}>
                            1. Acceptance
                        </div>
                        <div className={termsContentstyles.detailContainer}>
                            <textarea
                                id="scrollableTextarea"
                                value={text}
                                readOnly
                                rows={6}
                                style={{
                                    width: '100%',
                                    height: '250px',
                                    overflowY: 'scroll',
                                    fontFamily: 'Roboto',
                                    fontSize: '16px',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    lineHeight: '24px'
                                }}

                            />
                        </div>
                    </div>


                    <div className={termsContentstyles.options}>
                        <div onClick={handleCheckboxToggle}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" fill={isChecked ? "#546E7A" : "white"} stroke="#546E7A" />
                                {isChecked && (
                                    <path d="M6 12l4 4 8-8" stroke="white" strokeWidth="2" fill="none" />
                                )}
                            </svg>
                        </div>
                        <div className={termsContentstyles.text}>
                            By checking this box, you acknowledge that you have read and agree to the terms and conditions of use for the Union of Security Employees (USE) website. You also consent to the collection and retention of your data only for as long as necessary to fulfil the purposes of processing and issuing the ID card for which it was collected.                        </div>
                    </div>


                    <div className={termsContentstyles.box2}>
                        <button className={termsContentstyles.saveDraft}
                            onClick={onCancel} style={{ marginRight: '10px' }}>
                            <div className={globalStyleCss.regular}>Cancel</div>
                        </button>
                        <button className={termsContentstyles.continue} type='button' onClick={onContinue}>
                            <div className={globalStyleCss.buttonText}>Continue</div>
                        </button>
                    </div>
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>

        </div>
    );
};

export default TermsPage;
