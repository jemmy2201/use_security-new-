"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from './OtpPopup.module.css';
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OtpPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const OtpPopup: React.FC<OtpPopupProps> = ({ isOpen, onClose }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const { formData, setFormData } = useFormContext();

    // Create references for each OTP input field
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Function to handle OTP input changes
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Restrict input to a single character
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to the next input field
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleResend = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const response = await fetch('/api/sms/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobile: formData.mobileno,
            }),
        });
        const result = await response.json();

        console.log('send sms result:', result);

        if (result.success) {
            console.log('SMS sent:', result);
            toast.success('OTP resent', {
                position: 'top-right',
                autoClose: 3000,
            });
        } else {
            alert(result.message);
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        const otpValue = otp.join('');
        try {
            const response = await fetch('/api/sms/verify-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpValue }),
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prevFormData => ({
                    ...prevFormData,
                    isOtpVerified: true,
                    verifiedMobileNo: formData.mobileno,
                }));
                setErrorMessage(''); 
                toast.success('Mobile number successfully verified', {
                    position: 'top-right',
                    autoClose: 3000,
                    onClose: () => onClose()
                    
                });
            } else {
                console.error('Failed to verify OTP');
                setErrorMessage('Wrong OTP. Please try again.'); // Set error message
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('An error occurred. Please try again later.'); // Set error message
        }
    };

    // Reset OTP fields and error message when the popup opens
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '']);
            setErrorMessage(''); // Clear error message on open
            inputRefs.current[0]?.focus(); // Focus on the first input field when popup opens
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
                        <div className={globalStyleCss.header2}>Mobile Number Verification</div>
                    </div>
                    <div className={OtpModuleStyle.textDetails}>
                        <div className={globalStyleCss.regular}>You are required to verify your mobile number before proceeding.
                            <br></br>Enter the 4-digit OTP sent to your mobile number.</div>
                    </div>
                    <div className={OtpModuleStyle.otpBox}>
                        <div className={OtpModuleStyle.otpField}>
                            {otp.map((value, index) => (
                                <input
                                    key={`otp-${index}`}
                                    type="text"
                                    className={OtpModuleStyle.otpNumber}
                                    value={value}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    ref={(el) => inputRefs.current[index] = el}
                                />
                            ))}
                        </div>

                        {errorMessage && (
                            <div className={OtpModuleStyle.errorMessage}>
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <div>
                        <span className={OtpModuleStyle.otpText}>
                            <div className={globalStyleCss.regular}>Didn't receive the code? &nbsp;
                                <a href="#" onClick={handleResend} className={globalStyleCss.blueLink}>
                                    Click to resend
                                </a>
                            </div>
                        </span>

                    </div>

                    <div className={OtpModuleStyle.optButtonBox}>
                        <button type='button' onClick={onClose} className={OtpModuleStyle.cancelButton}><div className={globalStyleCss.regular}>Cancel</div></button>
                        <button type='button' onClick={handleSubmit} className={OtpModuleStyle.validateButton}><div className={globalStyleCss.regularWhite}>Validate</div></button>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default OtpPopup;
