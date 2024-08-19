import React from 'react';
import styles from './StepBar.module.css'; // Import CSS module for styling

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
    <div className={styles.stepBarContainer}>
        <ul className={styles.stepList}>
            {steps.map((step, index) => {
                const [number, ...textArray] = step.label.split(' '); // Split label into number and text
                const text = textArray.join(' '); // Join text parts into a single string
                return (
                    <li
                        key={index}
                        className={`${styles.stepItem} ${index === activeStep ? styles.active : ''}`}
                    >
                        <div className={styles.stepNumber}>{number}</div>
                        <div className={styles.stepText}>{text}</div>
                        {index < steps.length - 1 && <div className={styles.connectorLine}></div>}
                    </li>
                );
            })}
        </ul>
        <div className={styles.stepContent}>
            {steps[activeStep].content}
        </div>
    </div>
);

export default StepBar;
