"use client";

import React from 'react';
import styleBarModule from './StepBar.module.css';
// Define the type for the step content
interface Step {
    content: JSX.Element;
    label: string; // Label can contain both step number and text
}

// Define the props type for StepBar
interface StepBarProps {
    steps: Step[];
    activeStep: number; // Add activeStep to props
}

const StepBar: React.FC<StepBarProps> = ({ steps, activeStep }) => (
    <div className={styleBarModule.stepBarContainer}>
        <div className={styleBarModule.createNewPassCard}>
                <h2 className={styleBarModule.createNewPassCardText}>Create new pass card</h2>
        </div>
        <div>
            <ul className={styleBarModule.stepList}>
                {steps.map((step, index) => {
                    const [number, ...textArray] = step.label.split(' '); // Split label into number and text
                    const text = textArray.join(' '); // Join text parts into a single string
                    return (
                        <li
                            key={index}
                            className={`${styleBarModule.stepItem} ${index === activeStep ? styleBarModule.active : ''}`}
                        >
                            <div className={styleBarModule.stepNumber}>{number}</div>
                            <div className={styleBarModule.stepText}>{text}</div>
                            {index < steps.length - 1 && <div className={styleBarModule.connectorLine}></div>}
                        </li>
                    );
                })}
            </ul>
            <div className={styleBarModule.stepContent}>
                {steps[activeStep].content}
            </div>
        </div>
    </div>
);

export default StepBar;
