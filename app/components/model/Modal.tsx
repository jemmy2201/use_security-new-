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
            Pass card application restrictions
          </div>
          <div className={globalStyleCss.regular}>
            Security Officers who already hold an Aviation Security Officer (AVSO) pass card and Private investigator (PI) pass card are not eligible to apply for additional pass cards.
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
