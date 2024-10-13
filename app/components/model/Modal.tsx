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

        {message && message == '2' ? (
          <>
            <div className={styleCss.modelBox}>
              <div className={globalStyleCss.header2}>
                ID card not due for renewal
              </div>
              <div className={globalStyleCss.regular}>
                Your ID card must have at least 3 months remaining before its expiry date to be eligible for renewal.
              </div>
              <div className={styleCss.modelButton}>
                <button className={globalStyleCss.buttonTextBlack} onClick={onClose}>
                  Okay
                </button>
              </div>
            </div>
          </>
        ) :
          null

        }

        {message && message == '3' ? (
          <>
            <div className={styleCss.modelBox}>
              <div className={globalStyleCss.header2}>
                We noticed you do not have a valid card license or your licence may have expired.

              </div>
              <div className={globalStyleCss.regular}>
                It may take 48-72 hours for your approved data from Police Licensing and Regulatory Department (PLRD) to be updated on USE's ID card portal. Please try again later.
              </div>
              <div className={styleCss.modelButton}>
                <button className={globalStyleCss.buttonTextBlack} onClick={onClose}>
                  Okay
                </button>
              </div>
            </div>
          </>
        ) :
          null

        }

        {!message ? (
          <>
            <div className={styleCss.modelBox}>
              <div className={globalStyleCss.header2}>
                ID card application restrictions
              </div>
              <div className={globalStyleCss.regular}>
                Security Officers who already hold an Aviation Security Officer (AVSO) ID card and Private investigator (PI) ID card are not eligible to apply for additional pass cards.
              </div>
              <div className={styleCss.modelButton}>
                <button className={globalStyleCss.buttonTextBlack} onClick={onClose}>
                  Okay
                </button>
              </div>
            </div>
          </>
        ) :
          null

        }


      </div>

    </div>
  );
};

export default Modal;
