"use client";

import React from 'react';
import footerstyles from './FooterStyle.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';

const FooterPage: React.FC = () => {
    return (
        <div className={footerstyles.footerContainer}>
            <div className={footerstyles.boxUnderLine}>
                <div className={globalStyleCss.regularLinkWhite}>
                    <a
                        href="/content/user_guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="USE ID Card Web Portal User Guide"
                        aria-label="Open USE Portal User Guide PDF in new tab"
                    >
                        User Guide
                    </a>
                </div>
                <div>|</div>
                <div className={globalStyleCss.regularLinkWhite}>
                    <a
                        href="/content/terms.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Terms of Use"
                        aria-label="Open Terms & Conditions PDF in new tab"
                    >
                        Terms & Conditions
                    </a>
                </div>
                <div>|</div>
                <div className={globalStyleCss.regularLinkWhite}>
                    <a
                        href="/content/faq.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Frequently Asked Questions (FAQs)"
                        aria-label="Open FAQ PDF in new tab"
                    >
                        FAQs
                    </a>
                </div>
            </div>
            <div className={footerstyles.box}>
                <div className={globalStyleCss.regularLinkWhite}>Copyright © 2024 Union of Security Employees (USE). All rights reserved</div>
            </div>
        </div>
    );
};

export default FooterPage;
