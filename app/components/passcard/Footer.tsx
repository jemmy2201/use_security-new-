"use client";

import React from 'react';
import stepBarFooterStyle from './StepBarFooter.module.css'
import { useFormContext } from '.././FormContext';

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
                                    <h1>Save draft for later</h1>
                                </button>
                            </span>

                        )}

                        {!formData.paymentProcessed && (
                            <span className={stepBarFooterStyle.saveDraft}>
                                <button
                                    onClick={onBack}
                                    disabled={!hasBack}
                                    style={{ marginRight: '10px' }}
                                >
                                    <h1> Back</h1>
                                </button>
                            </span>

                        )}


                        <span className={stepBarFooterStyle.continue}>
                            <div>
                                <button
                                    onClick={onNext}

                                ><h1>
                                        {activeStep === 0 ? 'Application details' : ''}
                                        {activeStep === 1 ? 'Review details' : ''}
                                        {activeStep === 2 ? 'Make payment' : ''}
                                        {activeStep === 3 && !formData.paymentProcessed ? 'Proceed to pay' : ''}
                                        {activeStep === 3 && formData.paymentProcessed ? 'Book appointment' : ''}
                                        {activeStep === 4 && !formData.isAppointmentConfirmed ? 'Confirm appointment' : ''}
                                        {activeStep === 4 && formData.isAppointmentConfirmed ? 'Complete' : ''}
                                    </h1>
                                </button>
                            </div>
                        </span>
                    </div>

                
            </footer>
        );
    }
export default Footer;
