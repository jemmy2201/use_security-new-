"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from './OtpPopup.module.css';
import { useFormContext } from '../FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CancelPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

const CancelPopup: React.FC<CancelPopupProps> = ({ isOpen, onClose, onContinue }) => {
    const [errorMessage, setErrorMessage] = useState(''); 
    const { formData, setFormData } = useFormContext();

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

    if (!isOpen) return null; // Don't render the popup if it's not open

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'block'
        }}>
            <div className={OtpModuleStyle.container}>
                <div className={OtpModuleStyle.content}>
                    <div className={OtpModuleStyle.verifyMobileNumber}>
                        <div className={globalStyleCss.header2}>Cancel application?</div>
                    </div>
                    <div className={OtpModuleStyle.textDetails}>
                        <div className={globalStyleCss.regular}>Are you sure you want to cancel this application? This action cannot be undone.
                            </div>
                    </div>

                    <div className={OtpModuleStyle.optButtonBox}>
                    <button type='button' onClick={handleContinue} className={OtpModuleStyle.validateButton}><div className={globalStyleCss.regularWhite}>Cancel application</div></button>
                        <button type='button' onClick={handleCancel} className={OtpModuleStyle.cancelButton}><div className={globalStyleCss.regular}>Stay on page</div></button>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default CancelPopup;
