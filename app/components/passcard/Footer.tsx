"use client";

import React from 'react';
import stepBarFooterStyle from './StepBarFooter.module.css'
import styleBarModule from './StepBar.module.css';
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
                <div className={styleBarModule.footerContentDiv}>
                    <div className={stepBarFooterStyle.container}>
                        <div className={stepBarFooterStyle.buttonBox}>
                            <span className={stepBarFooterStyle.saveDraft}>
                                <button
                                    onClick={onSaveDraft}
                                    style={{ marginRight: 'auto' }} // Align Save Draft button to the left
                                >
                                    Save draft for later
                                </button>
                            </span>
                            <span className={stepBarFooterStyle.saveDraft}>
                                <button
                                    onClick={onBack}
                                    disabled={!hasBack}
                                    style={{ marginRight: '10px' }}
                                >
                                    Back
                                </button>
                            </span>
                            <span className={stepBarFooterStyle.continue}>
                                <div>
                                    <button
                                        onClick={onNext}
                                        disabled={!hasNext}
                                    >
                                        {activeStep === 0 ? 'Continue to application details' : ''}
                                        {activeStep === 1 ? 'Continue to review details' : ''}
                                        {activeStep === 2 ? 'Continue to make payment' : ''}
                                        {activeStep === 3 && !formData.paymentProcessed? 'Proceed to pay' : ''}
                                        {activeStep === 3 && formData.paymentProcessed ? 'Continue to book appointment' : ''}
                                        {activeStep === 5 ? 'Go to dashboard' : ''}
                                    </button>
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
export default Footer;
