"use client";

import React, { useEffect, useState } from 'react';
import StepBar from './StepBar';
import Footer from './Footer';

// Import the step components
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import OtpPopup from './OtpPopup';

import FooterPageLink from '../footer/FooterPage'
import HeaderPageLink from '../header/HeaderPage'
import { useFormContext } from '.././FormContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { booking_schedules } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';
import Link from 'next/link';
import mainPageModule from './MainPage.module.css';

interface ActionTypeProps {
    actionType: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


// Define the steps array with imported components and labels
const steps = [
    { content: <StepOne />, label: '1 Personal Details' },
    { content: <StepTwo />, label: '2 Application Details' },
    { content: <StepThree />, label: '3 Review Details' },
    { content: <StepFour />, label: '4 Make Payment' },
    { content: <StepFive />, label: '5 Book Appointment' },
];



const StepBarHomePage: React.FC<ActionTypeProps> = ({ actionType }) => {

    console.log('StepBarHomePage: Action Type', actionType);
    const [activeStep, setActiveStep] = useState<number>(0);
    const { formData, setFormData } = useFormContext();
    const [isOtpPopupOpen, setIsOtpPopupOpen] = useState<boolean>(false); // State for OTP popup
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();



    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
            console.log('inside stepbar page:');
            fetch(`/api/payment/success?session_id=${sessionId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('step bar page after payment success from stripe, data:', data);
                    const bookingData: booking_schedules = data;
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        applicationType: bookingData.app_type,
                        cardId: bookingData.card_id,
                        id: bookingData.id,
                        passId: bookingData.passid,
                        bookingId: bookingData.id,
                        ['paymentProcessed']: true,
                        ['paymentSuccess']: true,
                    }))
                    setIsPaymentSuccessful(true);
                    setActiveStep(3);
                }
                )
                .catch((err) => console.error(err));
        }
    }, [searchParams]);



    const handleNext = async () => {

        if (activeStep == 0) {
            if (!formData.email) {
                alert('Email is required.');
                return;
            }
            if (!formData.mobileno) {
                alert('Mobile number is required.');
                return;
            }
        }

        if (activeStep == 1) {
            if (!formData.applicationType) {
                alert('Application type is required.');
                return;
            }
            if (!formData.image && !formData.imageUrl) {
                alert('Photo is required.');
                return;
            }
            if (!formData.isFaceDetected || !formData.isBgColorMatch) {
                alert('There is problem with photo. Please upload again correct photo.');
                return;
            }
            if (!formData.trAvso && !formData.trCctc && !formData.trCsspb && !formData.trHcta && !formData.trRtt && !formData.trXray) {
                alert('Training record is required');
                return;
            }
        }

        if (activeStep == 2) {
            if (!formData.isTermsAndConditionSigned) {
                alert('Please tick the declaration');
                return;
            }
            await saveUserDetails();
            await saveApplicantDetails();
            await saveReviewDetails();

        }

        if (activeStep == 4) {

            if (!formData.isAppointmentConfirmed) {
                if (!formData.appointmentDate) {
                    alert('Appointment date is required.');
                    return;
                }
                if (!formData.timeSlot) {
                    alert('Please choose the time slot');
                    return;
                }
                try {
                    const response = await fetch('/api/handle-appointment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            appointmentDate: formData.appointmentDate,
                            timeSlot: formData.timeSlot,
                            applicationType: formData.applicationType,
                            bookingId: formData.id,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Appointment: Failed to save');
                    }
                    const result = await response.json();
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        ['isAppointmentConfirmed']: true,
                    }));
                    console.log("Appointment: Saved successfully:", result);
                } catch (error) {
                    console.error("Appointment: Error saving:", error);
                }
            } else {

                router.push('/dashboard');
            }
        } else {
            if (activeStep == 3 && !formData.paymentProcessed) {
                handleCheckout();
            } else {
                if (formData.originalMobileno === formData.mobileno
                    || (formData.isOtpVerified && formData.mobileno == formData.verifiedMobileNo)) {
                    console.log('same mobile');
                    setIsOtpPopupOpen(false);
                    if (activeStep < steps.length - 1) {
                        setActiveStep(prevStep => prevStep + 1);
                    }
                } else {
                    console.log('mobile changed');
                    const response = await fetch('/api/sms/send-sms', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData.mobileno),
                    });
                    const result = await response.json();

                    if (result.success) {
                        console.log('SMS sent:', result);
                    } else {
                        console.error('Failed to send SMS:', result.message);
                    }
                    setIsOtpPopupOpen(true);

                }
            }
        }
    };

    const saveUserDetails = async () => {
        try {
            const response = await fetch('/api/handle-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nric: formData.nric,
                    mobileno: formData.mobileno,
                    email: formData.email,
                    actionType: actionType,
                }),
            });

            if (!response.ok) {
                throw new Error('Personal Details: Failed to save draft');
            }

            const result = await response.json();
            console.log("Personal Details: Draft saved successfully:", result);
            console.log('showing toast message');

        } catch (error) {
            console.error("Personal Details: Error saving draft:", error);
        }
    }

    const saveApplicantDetails = async () => {
        try {

            console.log('application type: ', formData.applicationType);
            console.log('saveReviewDetails booking id', formData.bookingId);
            console.log('saveReviewDetails id', formData.id);
            if (formData.applicationType == '1') {
                const response = await fetch('/api/handle-applicant-details/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nric: formData.nric,
                        bookingId: formData.id,
                        applicationType: formData.applicationType,
                        cardId: formData.cardId,
                        trRtt: formData.trRtt ? 'YES' : '',
                        trCsspb: formData.trCsspb ? 'YES' : '',
                        trCctc: formData.trCctc ? 'YES' : '',
                        trHcta: formData.trHcta ? 'YES' : '',
                        trXray: formData.trXray ? 'YES' : '',
                        trAvso: formData.trAvso ? 'YES' : '',
                        trNota: formData.trNota ? 'YES' : '',
                        trObse: formData.trObse ? 'YES' : '',
                        trSsm: formData.trSsm ? 'YES' : '',
                        actionType: actionType,
                        image: formData.image,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Applicant Details: Failed to save draft');
                }
                const result = await response.json();
                console.log("Applicant Details: Draft saved successfully:", result);
            }

            if (formData.applicationType == '2') {
                const response = await fetch('/api/handle-applicant-details/replace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nric: formData.nric,
                        bookingId: formData.id,
                        applicationType: formData.applicationType,
                        cardId: formData.cardId,
                        trRtt: formData.trRtt ? 'YES' : '',
                        trCsspb: formData.trCsspb ? 'YES' : '',
                        trCctc: formData.trCctc ? 'YES' : '',
                        trHcta: formData.trHcta ? 'YES' : '',
                        trXray: formData.trXray ? 'YES' : '',
                        trAvso: formData.trAvso ? 'YES' : '',
                        trNota: formData.trNota ? 'YES' : '',
                        trObse: formData.trObse ? 'YES' : '',
                        trSsm: formData.trSsm ? 'YES' : '',
                        actionType: actionType,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Applicant Details: Failed to save draft');
                }
                const result = await response.json();
                console.log("Applicant Details: Draft saved successfully:", result);
            }

            if (formData.applicationType == '3') {
                const response = await fetch('/api/handle-applicant-details/renew', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nric: formData.nric,
                        bookingId: formData.id,
                        applicationType: formData.applicationType,
                        cardId: formData.cardId,
                        trRtt: formData.trRtt ? 'YES' : '',
                        trCsspb: formData.trCsspb ? 'YES' : '',
                        trCctc: formData.trCctc ? 'YES' : '',
                        trHcta: formData.trHcta ? 'YES' : '',
                        trXray: formData.trXray ? 'YES' : '',
                        trAvso: formData.trAvso ? 'YES' : '',
                        trNota: formData.trNota ? 'YES' : '',
                        trObse: formData.trObse ? 'YES' : '',
                        trSsm: formData.trSsm ? 'YES' : '',
                        actionType: actionType,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Applicant Details: Failed to save draft');
                }
                const result = await response.json();
                console.log("Applicant Details: Draft saved successfully:", result);
            }

        } catch (error) {
            console.error("Applicant Details: Error saving draft:", error);
        }
    }

    const saveReviewDetails = async () => {
        try {
            console.log('saveReviewDetails', formData.bookingId);
            const response = await fetch('/api/handle-review-details/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: formData.bookingId,
                    actionType: actionType,
                    applicationType: formData.applicationType,
                }),
            });

            if (!response.ok) {
                throw new Error('Applicant Details: Failed to save draft');
            }
            const result = await response.json();
            console.log("Review Details: Draft saved successfully:", result);
        } catch (error) {
            console.error("Review Details: Error saving draft:", error);
        }
    }

    const handleSaveDraft = async () => {
        if (activeStep == 0) {
            saveUserDetails();
            toast.success('Your draft has been saved', {
                position: 'top-right',
                autoClose: 3000,
            });
        }

        if (activeStep == 1) {
            if (!formData.applicationType) {
                alert('Application type is required.');
                return;
            }
            if (!formData.image && !formData.imageUrl) {
                alert('Photo is required.');
                return;
            }
            if (!formData.isFaceDetected || !formData.isBgColorMatch) {
                alert('There is problem with photo. Please upload again correct photo.');
                return;
            }
            if (!formData.trAvso && !formData.trCctc && !formData.trCsspb
                && !formData.trHcta && !formData.trRtt && !formData.trXray
                && !formData.trNota && !formData.trObse && !formData.trSsmy) {
                alert('Training record is required');
                return;
            }
            await saveUserDetails();
            await saveApplicantDetails();
            toast.success('Your draft has been saved', {
                position: 'top-right',
                autoClose: 3000,
            });
        }

        if (activeStep == 2) {
            await saveUserDetails();
            await saveApplicantDetails();
            await saveReviewDetails();
            toast.success('Your draft has been saved', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/payment/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: formData.id,
                    applicationType: formData.applicationType,
                    nric: formData.nric,
                }),
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (!error) {
                    // Optionally, handle success callback if needed after redirection
                } else {
                    console.error('Stripe error:', error);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing the payment.');
        }
        setLoading(false);
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(prevStep => prevStep - 1);
        }
    };

    const handleOtpCancel = () => {
        setIsOtpPopupOpen(false); // Close OTP popup if user cancels
    };

    return (
        <div>
            <HeaderPageLink></HeaderPageLink>


            {activeStep == 1 && (
                <>
                    <div className={mainPageModule.bodyContainer}>
                        <div className={mainPageModule.headerContainer}>
                            <div className={mainPageModule.linkBox}>
                                <button type='button' onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clip-path="url(#clip0_1433_2277)">
                                            <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#546E7A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1433_2277">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className={globalStyleCss.regularLinkBlack}><Link href="/signin">&nbsp;Back to Personal details</Link></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            {activeStep == 2 && (
                <>
                    <div className={mainPageModule.bodyContainer}>
                        <div className={mainPageModule.headerContainer}>
                            <div className={mainPageModule.linkBox}>
                                <button type='button' onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clip-path="url(#clip0_1433_2277)">
                                            <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#546E7A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1433_2277">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className={globalStyleCss.regularLinkBlack}><Link href="/signin">&nbsp;Back to Applicant details</Link></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeStep == 3 && (
                <>
                    <div className={mainPageModule.bodyContainer}>
                        <div className={mainPageModule.headerContainer}>
                            <div className={mainPageModule.linkBox}>
                                <button type='button' onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clip-path="url(#clip0_1433_2277)">
                                            <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#546E7A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1433_2277">
                                                <rect width="24" height="24" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className={globalStyleCss.regularLinkBlack}><Link href="/signin">&nbsp;Back to Review details</Link></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <main>
                <StepBar actionType={actionType} steps={steps} activeStep={activeStep} />
            </main>
            <Footer
                onNext={handleNext}
                onBack={handleBack}
                onSaveDraft={handleSaveDraft}
                hasNext={activeStep < steps.length - 1}
                hasBack={activeStep > 0}
                activeStep={activeStep}
            />
            <ToastContainer />
            <FooterPageLink></FooterPageLink>
            <OtpPopup
                isOpen={isOtpPopupOpen}
                onClose={handleOtpCancel}
            />
        </div>
    );
};

export default StepBarHomePage;
