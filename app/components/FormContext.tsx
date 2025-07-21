"use client";

import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the shape of the form data
interface FormData {
    id?: string;
    bookingId?: string;
    cardId?: string;
    actionType?: string;
    passId?: string;
    name?: string;
    nric?: string;
    nricText?: string;
    email?: string;
    originalMobileno?: string;
    mobileno?: string;
    applicationType?: string;
    trRtt?: string;
    trCsspb?: string;
    trCctc?: string;
    trHcta?: string;
    trXray?: string;
    trAvso?: string;
    trNota?: string;
    trObse?: string;
    trSsm?: string;
    image?: string;
    paymentMethod?: string;
    paymentProcessed?: boolean;
    paymentSuccess?: boolean;
    paymentFailure?: boolean;
    isOtpVerified?: boolean;
    verifiedMobileNo?: string;
    isFaceDetected?: boolean;
    isStraightFaceDetected?: boolean;
    isBgColorMatch?: boolean;
    isShoulderVisible?: boolean;
    isUpdated?: boolean;
    isTermsAndConditionSigned?: boolean;
    imageUrl?: string;
    appointmentDate?: Date;
    timeSlot?: string;
    pwmGrade?: string;
    isAppointmentConfirmed?: boolean;
    isDataLoaded?: boolean;
    grandTotal?: string;
    transactionReference?: string;
    errorMobileNumber?: string;
    errorEmail?: string;
    errorTrainingRecords?: string;
    errorPhoto?: string;
    errorDeclaration?: string;
    errorAppointmentDate?: string;
    errorAppointmentSlot?: string;
    [key: string]: any;
}

// Define the context type
interface FormContextProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors: { [key: string]: string };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    saveDraftFunction: (() => Promise<void>) | null;
    setSaveDraftFunction: React.Dispatch<React.SetStateAction<(() => Promise<void>) | null>>;
}

// Create the context with the correct type
const FormContext = createContext<FormContextProps | undefined>(undefined);

// Provider component
const FormProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [saveDraftFunction, setSaveDraftFunction] = useState<(() => Promise<void>) | null>(null);

    return (
        <FormContext.Provider value={{ formData, setFormData, errors, setErrors, saveDraftFunction, setSaveDraftFunction }}>
            {children}
        </FormContext.Provider>
    );
};

// Custom hook to use the context (optional but recommended)
const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

export { FormProvider, useFormContext };
