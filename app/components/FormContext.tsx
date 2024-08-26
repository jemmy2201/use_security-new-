import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the shape of the form data
interface FormData {
    name?: string;
    nric?: string;
    email?: string;
    originalMobileno?:string;
    mobileno?:string;
    applicationType?:string;
    trRtt?: string;
    trCsspb?: string;
    trCctc?: string;
    trHcta?: string;
    trXray?: string;
    trAvso?: string;
    image?: string;
    paymentProcessed?: boolean;
    paymentSuccess?: boolean;
    paymentFailure?: boolean;
    isOtpVerified?: boolean;
    verifiedMobileNo?: string;
    isFaceDetected?: boolean;
    isBgColorMatch?: boolean;
    [key: string]: any;
}

// Define the context type
interface FormContextProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Create the context with the correct type
const FormContext = createContext<FormContextProps | undefined>(undefined);

// Provider component
const FormProvider = ({ children }: { children: ReactNode }) => {
    const [formData, setFormData] = useState<FormData>({});

    return (
        <FormContext.Provider value={{ formData, setFormData }}>
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
