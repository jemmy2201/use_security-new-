"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from '../passcard/OtpPopup.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LogoutPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const LogoutPopup: React.FC<LogoutPopupProps> = ({ isOpen, onClose, onContinue }) => {
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
                    Would you like to save your changes before leaving this page? Your draft will be accessible for the next 14 days.
                </div>

                <div className={OtpModuleStyle.buttonContainer}>

                    <div className={OtpModuleStyle.buttonContainer}>
                        <div className={OtpModuleStyle.validateButton} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button type='button' onClick={handleContinue}>
                                <div className={globalStyleCss.regularWhite} style={{ textAlign: 'center' }}>
                                    Save draft
                                </div>
                            </button>
                        </div>
                        <div className={OtpModuleStyle.cancelButton} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <button type='button' onClick={handleCancel}>
                                <div className={globalStyleCss.regular} style={{ textAlign: 'center' }}>
                                    Leave without saving
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoutPopup;
