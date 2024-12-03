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
      <div className={styleCss.modelContainer}>
        <div className={styleCss.modelBox}>
          <div className={globalStyleCss.header2}>
          Your security licence may have expired or pending approval.
          </div>
          <div className={globalStyleCss.regular}>
            For successful application, it may take  48 -72 hours for your approved data from the Police Licensing and Regulatory Department (PLRD) to be updated on USE's ID card portal. Please try again later.
          </div>
          <div className={styleCss.modelButton}>
            <button className={globalStyleCss.buttonTextBlack} onClick={onClose}>
              Okay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Modal;
