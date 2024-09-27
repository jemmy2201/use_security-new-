"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from './OtpPopup.module.css';
import { useFormContext } from '.././FormContext';

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

    // Function to handle form submission
    const handleSubmit = async () => {
        const otpValue = otp.join(''); // Combine the OTP values into a single string
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
                console.log('OTP verified successfully:', data);
                // Handle success
                setFormData(prevFormData => ({
                    ...prevFormData,
                    isOtpVerified: true,
                    verifiedMobileNo: formData.mobileno,
                }));
                setErrorMessage(''); // Clear any previous error messages
                onClose();
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
                        <h2>Verify your mobile number</h2>
                    </div>
                    <div className={OtpModuleStyle.textDetails}>
                        <h2>Before you continue, you are required to verify your mobile number. Enter the 4-digit OTP sent to your mobile number.</h2>
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
                                    ref={(el) => inputRefs.current[index] = el} // Assign ref to each input
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
                            <h2>Didn’t get the code?</h2>
                        </span>
                        <span className={OtpModuleStyle.resendCodeText}>
                           <h2> Resend code</h2>
                        </span>
                    </div>

                    <div className={OtpModuleStyle.optButtonBox}>
                        <button onClick={onClose} className={OtpModuleStyle.cancelButton}><h2>Cancel</h2></button>
                        <button onClick={handleSubmit} className={OtpModuleStyle.validateButton}><h2>Validate</h2></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpPopup;
