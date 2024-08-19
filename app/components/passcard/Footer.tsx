"use client";

import React from 'react';

interface FooterProps {
    onNext: () => void;
    onBack: () => void;
    onSaveDraft: () => void;
    hasNext: boolean;
    hasBack: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNext, onBack, onSaveDraft, hasNext, hasBack }) => (
    <footer style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    }}>
        <button 
            onClick={onSaveDraft}
            style={{ marginRight: 'auto' }} // Align Save Draft button to the left
        >
            Save Draft
        </button>
        <div>
            <button 
                onClick={onBack}
                disabled={!hasBack}
                style={{ marginRight: '10px' }}
            >
                Back
            </button>
            <button 
                onClick={onNext}
                disabled={!hasNext}
            >
                Next
            </button>
        </div>
    </footer>
);

export default Footer;
