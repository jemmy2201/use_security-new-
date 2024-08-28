"use client";

import React from 'react';
import footerstyles from './FooterStyle.module.css';

const FooterPage: React.FC = () => {
    return (<div className={footerstyles.footer}>
        <div className={footerstyles.cta}>
            <div className={footerstyles.text}><h1>Privacy Notice</h1></div>
            <div className={footerstyles.text}>|</div>
            <div className={footerstyles.text}><h1>Terms & Conditions</h1></div>
            <div className={footerstyles.text}>|</div>
            <div className={footerstyles.text}><h1>FAQs</h1></div>
        </div>
        <div className={footerstyles.copyright}>
            <div><h1>Copyright © 2024 Union of Security Employees (USE). All rights reserved.</h1></div>
        </div>
    </div>
    );
};

export default FooterPage;
