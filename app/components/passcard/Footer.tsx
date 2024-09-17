"use client";

import React from 'react';
import stepBarFooterStyle from './StepBarFooter.module.css'
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FooterProps {
    onNext: () => void;
    onBack: () => void;
    onSaveDraft: () => void;
    hasNext: boolean;
    hasBack: boolean;
    activeStep: number;
}

const Footer: React.FC<FooterProps> =
    ({ onNext, onBack, onSaveDraft, hasNext, hasBack, activeStep }) => {
        const { formData, setFormData } = useFormContext();
        return (
            <footer>
                <div className={stepBarFooterStyle.stepFooterContainer}>
                    {!formData.paymentProcessed && (
                        <span className={stepBarFooterStyle.saveDraft}>
                            <button onClick={onSaveDraft} style={{ marginRight: 'auto' }}>
                                <div className={globalStyleCss.regular}>Save draft</div>
                            </button>
                            <ToastContainer />
                        </span>

                    )}

                    {activeStep != 0 && !formData.paymentProcessed && (
                        <span className={stepBarFooterStyle.saveDraft}>
                            <button
                                onClick={onBack}
                                disabled={!hasBack}
                                style={{ marginRight: '10px' }}
                            >
                                <ToastContainer />
                                <div className={globalStyleCss.regular}>Back</div>
                            </button>
                        </span>

                    )}


                    <span className={stepBarFooterStyle.continue}>
                        <div>
                            <button
                                onClick={onNext}

                            ><div className={globalStyleCss.buttonText}>
                                    {activeStep === 0 ? 'Application details' : ''}
                                    {activeStep === 1 ? 'Review details' : ''}
                                    {activeStep === 2 ? 'Make payment' : ''}
                                    {activeStep === 3 && !formData.paymentProcessed ? 'Proceed to pay' : ''}
                                    {activeStep === 3 && formData.paymentProcessed ? 'Book appointment' : ''}
                                    {activeStep === 4 && !formData.isAppointmentConfirmed ? 'Confirm appointment' : ''}
                                    {activeStep === 4 && formData.isAppointmentConfirmed ? 'Complete' : ''}
                                </div>
                            </button>
                        </div>
                    </span>
                </div>


            </footer>
        );
    }
export default Footer;
