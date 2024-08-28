"use client";

import React from 'react';
import headerstyles from './HeaderStyle.module.css';

const HeaderPage: React.FC = () => {
    return (
        <div className={headerstyles.header}>
            <div className={headerstyles.leftHeader}>
                <span className={headerstyles.logo}><img src="/images/logo.png" alt="Logo" /></span>
                <span className={headerstyles.useText}><h1>Union of Security Employees (USE)</h1></span>
            </div>
            <div className={headerstyles.headercontainer}>
                <span className={headerstyles.contactus}>
                    <h1>Contact Us</h1>
                </span>
                <span className={headerstyles.logoutButton}>
                    <button><h2>Log out</h2></button>
                </span>
            </div>
        </div>
    );
};

export default HeaderPage;




