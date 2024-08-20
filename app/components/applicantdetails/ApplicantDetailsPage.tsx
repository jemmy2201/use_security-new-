"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import applicantDetailsstyles from './ApplicantDetailsStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import applicantDetailsContentstyles from './ApplicantDetailsContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
i

const ApplicantDetailsPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();




    return (<div className={applicantDetailsstyles.container}>
        <div className={applicantDetailsstyles.overlay}>
            <div className={applicantDetailsstyles.content}>
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

                <div className={applicantDetailsContentstyles.content}>
                    <div className={applicantDetailsContentstyles.content}>
                        <div>
                            
                        </div>
                    </div>

                    <div className={applicantDetailsContentstyles.uploadPhoto}>

                    </div>

                    <div className={applicantDetailsContentstyles.trainingRecord}>

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

export default ApplicantDetailsPage;
