"use client";
import React, { useState } from 'react';

const StepOne: React.FC = () => {
    // State variables to store the input values
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    // Handlers for input changes
    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactNumber(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <div style={{ textAlign: 'left' }}>
            <div>
                <label htmlFor="contactNumber">Contact Details:</label><br></br>
                <input 
                    type="text" 
                    id="contactNumber"
                    value={contactNumber} 
                    onChange={handleContactNumberChange} 
                    placeholder="Enter your contact number"
                />
            </div>

            <div>
                <label htmlFor="lastName">Email Address:</label><br></br>
                <input 
                    type="text" 
                    id="email"
                    value={email} 
                    onChange={handleEmailChange} 
                    placeholder="Enter your email"
                />
            </div>
        </div>
    );
};

export default StepOne;
