"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from '../passcard/OtpPopup.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import 'react-toastify/dist/ReactToastify.css';

interface SessionTimeoutPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const SessionTimeoutPopup: React.FC<SessionTimeoutPopupProps> = ({ isOpen, onClose, onContinue }) => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleCancel = async () => {
        onClose();
    };

    const handleContinue = async () => {
        onContinue();
    };

    useEffect(() => {
        if (isOpen) {
            setErrorMessage('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={OtpModuleStyle.centeredModal}>
            <div className={OtpModuleStyle.container}>

                <div className={globalStyleCss.header2}>Don’t lose your progress!</div>

                <div className={globalStyleCss.regular}>
                    Your session is about to expire. Do you want to refresh?.
                </div>

                <div className={OtpModuleStyle.buttonContainer}>

                    <div className={OtpModuleStyle.buttonContainer}>
                        <div className={OtpModuleStyle.validateButton} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button type='button' onClick={handleContinue}>
                                <div className={globalStyleCss.regularWhite} style={{ textAlign: 'center' }}>
                                    Continue
                                </div>
                            </button>
                        </div>
                        <div className={OtpModuleStyle.cancelButton} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button type='button' onClick={handleCancel}>
                                <div className={globalStyleCss.regular} style={{ textAlign: 'center' }}>
                                    Logout
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutPopup;
