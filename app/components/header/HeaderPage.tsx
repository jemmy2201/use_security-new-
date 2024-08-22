"use client";

import React from 'react';
import headerstyles from './HeaderStyle.module.css';

const HeaderPage: React.FC = () => {
    return (
        <div className={headerstyles.header}>
            <div className={headerstyles.leftHeader}>
                <span className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></span>
                <span className={headerstyles.useText}><p>Union of Security Employees (USE)</p></span>
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
    );
};

export default HeaderPage;




