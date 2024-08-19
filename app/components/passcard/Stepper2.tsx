"use client";
import React from 'react';

interface Stepper2Props {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

const Stepper2: React.FC<Stepper2Props> = ({ currentStep, totalSteps, onNext, onPrevious }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button disabled={currentStep === 1} onClick={onPrevious}>
          Previous
        </button>
        <span>{`Step ${currentStep} of ${totalSteps}`}</span>
        <button disabled={currentStep === totalSteps} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Stepper2;
