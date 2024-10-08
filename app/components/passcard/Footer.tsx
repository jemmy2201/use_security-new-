"use client";

import React from 'react';
import stepBarFooterStyle from './StepBarFooter.module.css'
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

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
                <div className={stepBarFooterStyle.bodyContainer}>
                    <div className={stepBarFooterStyle.headerContainer}>
                        {/* <div className={globalStyleCss.regularLinkBlack}><Link href="/homepage">Cancel</Link></div> */}
                        <div className={stepBarFooterStyle.saveDraft}>
                            <Link href="/homepage">
                                <div className={globalStyleCss.regular}>Cancel</div>
                            </Link>
                        </div>

                        {!formData.paymentProcessed && (
                            <div className={stepBarFooterStyle.saveDraft}>
                                <button type='button' onClick={onSaveDraft}>
                                    <div className={globalStyleCss.regular}>Save draft</div>
                                </button>
                                <ToastContainer />
                            </div>

                        )}
                        {!formData.isAppointmentConfirmed && (
                            <div className={stepBarFooterStyle.continue}>
                                <div>
                                    <button type='button'
                                        onClick={onNext}>
                                        <div className={globalStyleCss.buttonText}>
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
                            </div>
                        )}
                        {activeStep != 0 && !formData.paymentProcessed && (
                            <div className={stepBarFooterStyle.saveDraft}>
                                <button type='button'
                                    onClick={onBack}
                                    disabled={!hasBack}>
                                    <div className={globalStyleCss.regular}>Back</div>
                                </button>
                            </div>

                        )}
                    </div>


                </div>

            </footer>
        );
    }
export default Footer;
