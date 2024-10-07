"use client";

import React, { useState, useEffect, useRef } from 'react';
import OtpModuleStyle from './OtpPopup.module.css';
import { useFormContext } from '../FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';

interface OtpPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateModel: React.FC<OtpPopupProps> = ({ isOpen, onClose }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const { formData, setFormData } = useFormContext();


  const handleSubmit = async () => {

    try {
      const response = await fetch('/api/update-personal-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: formData.bookingId,
          mobileno: formData.mobileno,
          email: formData.email,
          pwmGrade: formData.pwmGrade,
          trRtt: formData.trRtt ? 'YES' : '',
          trCsspb: formData.trCsspb ? 'YES' : '',
          trCctc: formData.trCctc ? 'YES' : '',
          trHcta: formData.trHcta ? 'YES' : '',
          trXray: formData.trXray ? 'YES' : '',
          trAvso: formData.trAvso ? 'YES' : '',
          trNota: formData.trNota ? 'YES' : '',
          trSsm: formData.trSsm ? 'YES' : '',
          trObse: formData.trObse ? 'YES' : '',
        }),
      });
      if (!response.ok) {
        throw new Error('Update personal details: Failed to save');
      }

      if (response.ok) {
        const data = await response.json();
        setFormData(prevFormData => ({
          ...prevFormData,
          isUpdated: true,
        }));
        setErrorMessage('');
        onClose();
      } else {
        setErrorMessage('Error in update details. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };


  if (!isOpen) return null;

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
            <h2>Save changes</h2>
          </div>
          <div className={OtpModuleStyle.textDetails}>
            By clicking “Save changes”, I hereby certify that the information and photograph provided are accurate and complete. I acknowledge that should any of this information be found to be false, misleading, or misrepresentative, I may be held legally responsible.
          </div>

          <div className={OtpModuleStyle.optButtonBox}>
            <button onClick={onClose} className={OtpModuleStyle.cancelButton}><h2>Cancel</h2></button>
            <button onClick={handleSubmit} type='button' className={OtpModuleStyle.validateButton}><h2>Save changes</h2></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateModel;
