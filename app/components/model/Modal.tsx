import React from 'react';
import styleCss from './Popup.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';


interface ModalProps {
  message: string;
  onClose: () => void;
}

// message=='2' means ID Card is not due for renewal 
// message=='3' means Security licence may have expired or pending approval.

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className={styleCss.modaloverlay}>
      <div className={styleCss.modelContainer}>
        {message && message == '2' ? (
          <>
            <div className={styleCss.modelBox}>
              <div className={globalStyleCss.header2}>
                ID Card is not due for renewal.
              </div>
              <div className={globalStyleCss.regular}>
              The renewal notice will be sent by to you by Police Regulatory Department 3 months prior to your licence expiry date.
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
              Your security licence may have expired or pending approval.
              </div>
              <div className={globalStyleCss.regular}>
              For successful application, it may take  48-72 hours for your approved data from the Police Licensing and Regulatory Department (PLRD) to be updated on USE&apos;s ID card portal. Please try again later.
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
                ID Card Application Advisory
              </div>
              <div className={globalStyleCss.regular}>
              If you already have a Security Officer (SO) ID card and Private Investigator (PI) ID card, you are not eligible to apply for other ID cards.
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
