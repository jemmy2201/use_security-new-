import React from 'react';
import OtpModuleStyle from './OtpPopup.module.css';

interface OtpPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

const OtpPopup: React.FC<OtpPopupProps> = ({ isOpen, onClose, onSubmit }) => {
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
                        Verify your mobile number
                    </div>
                    <div className={OtpModuleStyle.textDetails}>
                        Before you continue, you are required to verify your mobile number. Enter the 4-digit OTP sent to your mobile number.
                    </div>
                    <div className={OtpModuleStyle.otpBox}>
                        <div className={OtpModuleStyle.otpField}>
                            <input type="text" className={OtpModuleStyle.otpNumber} />
                            <input type="text" className={OtpModuleStyle.otpNumber} />
                            <input type="text" className={OtpModuleStyle.otpNumber} />
                            <input type="text" className={OtpModuleStyle.otpNumber} />
                        </div>
                    </div>

                    <div >
                        <span className={OtpModuleStyle.otpText}>
                            Didn’t get the code?
                        </span>
                        <span className={OtpModuleStyle.resendCodeText}>
                            Resend code
                        </span>
                    </div>

                    <div className={OtpModuleStyle.optButtonBox}>

                        <button onClick={onSubmit} className={OtpModuleStyle.cancelButton}>Cancel</button>
                        <button onClick={onClose} className={OtpModuleStyle.validateButton}>Validate</button>
                    </div>


                </div>

            </div>
        </div>
    );
};

export default OtpPopup;
