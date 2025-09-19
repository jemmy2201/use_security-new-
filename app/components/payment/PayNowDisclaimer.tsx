"use client";

import React from 'react';
import makePaymentContentstyles from './MakePaymentContent.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';

const PayNowDisclaimer: React.FC = () => {
    return (
        <div className={makePaymentContentstyles.warningContainer}>
            <div className={makePaymentContentstyles.warningBox}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_1358_8597)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
                    </g>
                    <defs>
                        <clipPath id="clip0_1358_8597">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                <div className={globalStyleCss.regular}> &nbsp;Please do not refresh or close the next page while your payment is processing, to avoid an unsuccessful application</div>
            </div>
        </div>
    );
};

export default PayNowDisclaimer;
