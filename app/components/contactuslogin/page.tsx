"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import contactusContentstyles from './ContactusContent.module.scss';
import globalStyleCss from '../globalstyle/Global.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const ContactusPage: React.FC = () => {

    const handleLoginClick = async () => {
        signIn('singpass');
    };

    return (

        <form>

            <div >
                <HeaderPageLink />
            </div>
            <div className={contactusContentstyles.mainContainer}>
                <div className={contactusContentstyles.contactusContainer}>
                    <div className={globalStyleCss.header2}>
                        Contact Us
                    </div>

                    <div className={contactusContentstyles.bodyContainer}>
                        <div className={globalStyleCss.header2}>
                            Union of Security Employees (USE)
                        </div>

                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Customer Service Centre</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>+65 6381 9150<br></br>+65 6291 5145</div>
                            </div>
                        </div>
                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Email</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>use-idcard@ntuc.org.sg</div>
                            </div>
                        </div>
                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Location</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>Union of Security Employees (USE)
                                    <br></br>200 Jalan Sultan
                                    <br></br>#03-24 Textile Centre
                                    <br></br>Singapore 199018
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>

        </form>
    );
};

export default ContactusPage;
