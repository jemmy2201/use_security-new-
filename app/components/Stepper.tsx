"use client";
import React from 'react';

interface StepperProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: currentStep === index ? '2px solid blue' : '2px solid gray',
          }}
          onClick={() => onStepClick(index)}
        >
          {`Step ${index + 1}: ${step}`}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
