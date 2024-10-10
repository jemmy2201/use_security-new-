"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CompleteContentstyles from './CompleteContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import globalStyleCss from '../globalstyle/Global.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { booking_schedules } from '@prisma/client';
import CircularProgress from '@mui/material/CircularProgress';

interface CompletePageProps {
    bookingId: string;
    reschedule: string;
}

const CompletePage: React.FC<CompletePageProps> = ({ bookingId, reschedule }) => {
    console.log('Booking ID:', bookingId);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();

    const formatExpiryDate = (dateStringExpiryDate: string) => {
        console.log('dateStringExpiryDate:', dateStringExpiryDate);
        if (!dateStringExpiryDate) {
            return '';
        }
        const [day, month, year] = dateStringExpiryDate.split('/').map(Number);


        const date = new Date(year, month - 1, day);

        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);

        return formattedDate;
    };


    const formatAppointmentDate = (dateString: string) => {
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);

        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const onReschedule = () => {
        setLoading(true);
        setError(null);
        console.log('bookingId', bookingId);
        try {
            router.push(`/reschedule?bookingId=${encodeURIComponent(bookingId)}`);
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const onComplete = async () => {
        router.push('/homepage');
    };

    useEffect(() => {
        const fetchBookingSchedule = async () => {
            try {
                setLoading(true);
                const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
                if (!responseBookingSchedule.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
                setBookingSchedule(dataBookingSchedule);
            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            } finally{
                setLoading(false);
            }
        };
        fetchBookingSchedule();

    }, []);


    return (

        <form>
            <div >
                <HeaderPageLink />
            </div>
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}             
            <div className={CompleteContentstyles.container}>

                {reschedule && (
                    <>
                        <div className={globalStyleCss.header1}>
                            Reschedule Appointment
                        </div>
                    </>
                )}

                {!reschedule && (
                    <>
                        <div className={globalStyleCss.header1}>
                            Book Appointment
                        </div>
                    </>
                )}

                <div className={CompleteContentstyles.innerContainer}>
                    <div className={CompleteContentstyles.appointmentDetails}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <g clipPath="url(#clip0_1255_11911)">
                                    <path d="M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM33.62 18.18L22.62 33.18C22.26 33.68 21.7 33.98 21.08 34C21.06 34 21.02 34 21 34C20.42 34 19.88 33.76 19.5 33.32L12.5 25.32C11.78 24.48 11.86 23.22 12.68 22.5C13.52 21.78 14.78 21.86 15.5 22.68L20.86 28.8L30.38 15.82C31.04 14.94 32.28 14.74 33.18 15.4C34.08 16.04 34.26 17.3 33.62 18.18Z" fill="#00695C" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1255_11911">
                                        <rect width="48" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                        <span className={globalStyleCss.header2}>
                            Appointment successfully booked
                        </span>
                    </div>
                    <div className={CompleteContentstyles.innerContainerBox}>
                        <div className={globalStyleCss.header2}>
                            Appointment details
                        </div>
                        <div className={CompleteContentstyles.smsTextContainer}>
                            <div className={globalStyleCss.regular}>An SMS reminder will be sent to you 3 days before the collection date.</div>
                        </div>
                        <div className={CompleteContentstyles.collectionTextContainer}>
                            <span className={CompleteContentstyles.collectionTextSpan}>
                                <div className={globalStyleCss.regularBold}>
                                    Collection Date
                                </div>
                                <div className={globalStyleCss.regular}>
                                    {formatAppointmentDate(bookingSchedule?.appointment_date ? bookingSchedule.appointment_date : '') || ''}
                                </div>
                            </span>

                            <span className={CompleteContentstyles.collectionTextSpan}>
                                <div className={globalStyleCss.regularBold}>
                                    Collection time slot
                                </div>
                                <div className={globalStyleCss.regular}>
                                    {bookingSchedule?.time_start_appointment} - {bookingSchedule?.time_end_appointment}
                                </div>
                            </span>

                        </div>
                        <div className={CompleteContentstyles.collectionTextContainer}>
                            <span className={CompleteContentstyles.collectionTextSpan}>
                                <div className={globalStyleCss.regularBold}>
                                    Pass card no.
                                </div>
                                <div className={globalStyleCss.regular}>
                                    {bookingSchedule?.passid}
                                </div>
                            </span>

                            <span className={CompleteContentstyles.collectionTextSpan}>
                                <div className={globalStyleCss.regularBold}>
                                    Pass card date of expiry
                                </div>
                                <div className={globalStyleCss.regular}>
                                    {formatExpiryDate(bookingSchedule?.expired_date ? bookingSchedule.expired_date : '')}
                                </div>
                            </span>

                        </div>
                        <div className={CompleteContentstyles.collectionCenterContainer}>
                            <div className={globalStyleCss.regularBold}>
                                Collection centre
                            </div>
                            <div className={globalStyleCss.regular}>
                                Union of Security Employees (USE)<br></br>
                                200 Jalan Sultan<br></br>
                                #03-24 Textile Centre<br></br>
                                Singapore 199018<br></br>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={CompleteContentstyles.buttonContainer}>
                    <button className={CompleteContentstyles.saveDraft} type='button' onClick={onReschedule} style={{ marginRight: '10px' }}>
                        <div className={globalStyleCss.regular}>Reschedule Appointment</div>
                    </button>
                    <button className={CompleteContentstyles.continue} type='button' onClick={onComplete}>
                        <div className={globalStyleCss.buttonText}>Complete</div>
                    </button>
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default CompletePage;
