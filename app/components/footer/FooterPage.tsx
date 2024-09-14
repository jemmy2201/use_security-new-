"use client";

import React from 'react';
import footerstyles from './FooterStyle.module.css';

const FooterPage: React.FC = () => {
    return (<div className={footerstyles.footerContainer}>
        <div className={footerstyles.boxUnderLine}>
            <div>Privacy Notice</div>
            <div>|</div>
            <div>Terms & Conditions</div>
            <div>|</div>
            <div>FAQs</div>
        </div>
        <div className={footerstyles.box}>
            <div>Copyright © 2024 Union of Security Employees (USE). All rights reserved</div>
        </div>
    </div>
    );
};

export default FooterPage;
