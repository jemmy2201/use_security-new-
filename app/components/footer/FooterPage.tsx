"use client";

import React from 'react';
import footerstyles from './FooterStyle.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';

const FooterPage: React.FC = () => {
    return (<div className={footerstyles.footerContainer}>
        <div className={footerstyles.boxUnderLine}>
            <div className={globalStyleCss.regularLinkWhite}>User Guide</div>
            <div>|</div>
            <div className={globalStyleCss.regularLinkWhite}>Terms & Conditions</div>
            <div>|</div>
            <div className={globalStyleCss.regularLinkWhite}>  
                <a href="/content/faq.pdf" target="_blank" rel="noopener noreferrer">FAQs</a>
            </div>
        </div>
        <div className={footerstyles.box}>
            <div className={globalStyleCss.regularLinkWhite}>Copyright © 2024 Union of Security Employees (USE). All rights reserved</div>
        </div>
    </div>
    );
};

export default FooterPage;
