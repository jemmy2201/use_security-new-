import React from 'react';
import styleCss from './Popup.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';


interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className={styleCss.modaloverlay}>
      <div className={styleCss.modalcontent}>
        <div className={styleCss.modalbody}>
          <div className={globalStyleCss.header2}>
          We noticed you do not have a valid card license or your licence may have expired.
          </div>
          <div className={globalStyleCss.regular}>
          It may take 48-72 hours for your approved data from Police Licensing and Regulatory Department (PLRD) to be updated on USE's ID card portal. Please try again later.
          </div>
        </div>
        <div className={styleCss.modelButton}>
          <button className={globalStyleCss.butonText} onClick={onClose}>
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
