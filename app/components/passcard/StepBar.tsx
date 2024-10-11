"use client";

import React from 'react';
import styleBarModule from './StepBar.module.css';
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useEffect, useState } from 'react';

// Define the type for the step content
interface Step {
    content: JSX.Element;
    label: string;
}

// Define the props type for StepBar
interface StepBarProps {
    actionType: string;
    steps: Step[];
    activeStep: number; // Add activeStep to props
}

const StepBar: React.FC<StepBarProps> = ({ actionType, steps, activeStep }) => {

    // console.log('StepBar: Action Type:', actionType);
    const { formData, setFormData } = useFormContext();

    return (

        <div className={styleBarModule.bodyContainer}>
            <div className={styleBarModule.headerContainer}>
                <div className={styleBarModule.pageHeading}>
                    {formData.applicationType == '1' && formData.cardId == '1' ? (
                        <>
                            <div className={globalStyleCss.header2}>Application for New ID Card:</div>
                            <div className={globalStyleCss.header2}>Security Officer (SO) / Aviation Security Officer (AVSO)</div>
                        </>
                    ) : <> </>}

                    {formData.applicationType == '2' && formData.cardId == '1' ? (
                        <>
                            <div className={globalStyleCss.header2}>Replace ID Card:</div>
                            <div className={globalStyleCss.header2}>Security Officer (SO) / Aviation Security Officer (AVSO)</div>
                        </>
                    ) : <> </>}

                    {formData.applicationType == '3' && formData.cardId == '1' ? (
                        <>
                            <div className={globalStyleCss.header2}>Renew ID Card:</div>
                            <div className={globalStyleCss.header2}>Security Officer (SO) / Aviation Security Officer (AVSO)</div>
                        </>
                    ) : <> </>}


                    {formData.applicationType == '1' && formData.cardId == '2' ? (
                        <>
                            <div className={globalStyleCss.header2}>Application for New ID Card: Personal Investigator (PI)</div>
                        </>
                    ) : <> </>}

                    {formData.applicationType == '2' && formData.cardId == '2' ? (
                        <>
                            <div className={globalStyleCss.header2}>Replace ID Card: Personal Investigator (PI)</div>
                        </>
                    ) : <> </>}

                    {formData.applicationType == '3' && formData.cardId == '2' ? (
                        <>
                            <div className={globalStyleCss.header2}>Renew ID Card: Personal Investigator (PI)</div>
                        </>
                    ) : <> </>}

                </div>
                <div className={styleBarModule.menuBar}>
                    <ul className={styleBarModule.stepList}>
                        {steps.map((step, index) => {
                            const [number, ...textArray] = step.label.split(' ');
                            const text = textArray.join(' ');

                            if (index === activeStep) {
                                return (
                                    <li
                                        key={`stepbar-${index}`}
                                        className={`${styleBarModule.stepItem} ${styleBarModule.active}`}
                                    >
                                        <div className={styleBarModule.stepNumber}>{number}</div>
                                        <div className={styleBarModule.stepText}><h1>{text}</h1></div>
                                        {index < steps.length - 1 && <div className={styleBarModule.connectorLine}></div>}
                                    </li>
                                );
                            }

                            if (index < activeStep) {
                                return (
                                    <li
                                        key={index}
                                        className={`${styleBarModule.stepItem} ${styleBarModule.completed}`}  
                                    >
                                        <div className={styleBarModule.stepNumber}>{}</div>
                                        <div className={styleBarModule.stepText}><h1>{text}</h1></div>
                                        {index < steps.length - 1 && <div className={styleBarModule.connectorLine}></div>}
                                    </li>
                                );
                            }

                            if (index > activeStep) {
                                return (
                                    <li
                                        key={index}
                                        className={`${styleBarModule.stepItem}`} 
                                    >
                                        <div className={styleBarModule.stepNumber}>{number}</div>
                                        <div className={styleBarModule.stepText}><h1>{text}</h1></div>
                                        {index < steps.length - 1 && <div className={styleBarModule.connectorLine}></div>}
                                    </li>
                                );
                            }
                        })}
                    </ul>

                </div>

                {steps[activeStep].content}

            </div>
        </div>
    );
};

export default StepBar;
