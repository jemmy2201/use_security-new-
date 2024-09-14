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
    <div className={styleBarModule.headerContainer}>
        <div className={styleBarModule.pageHeading}>
            Apply for new pass card: Security Officer (SO)/Aviation Security Officer (AVSO)
        </div>
        <div className={styleBarModule.menuBar}>
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
                            <div className={styleBarModule.stepText}><h1>{text}</h1></div>
                            {index < steps.length - 1 && <div className={styleBarModule.connectorLine}></div>}
                        </li>
                    );
                })}
            </ul>
        </div>

        {steps[activeStep].content}

    </div>
);

export default StepBar;
