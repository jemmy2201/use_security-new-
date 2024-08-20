"use client";

import React from 'react';
import footerstyles from './FooterStyle.module.css';

const FooterPage: React.FC = () => {
    return (<div className={footerstyles.footer}>
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
    );
};

export default FooterPage;
