"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import bookAppointmentContentstyles from './BookAppointmentContent.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { useFormContext } from '../FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';
import { booking_schedules } from '@prisma/client';
type DisabledDatesResponse = string[]; // Array of ISO date strings

const BookAppointmentCompletePage: React.FC = () => {

    const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const { formData, setFormData } = useFormContext();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const router = useRouter();

    // State variables to store the input values
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');


    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<users>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookingSchedule = async () => {
            try {
                const bookingId = formData.id ? formData.id : '';
                const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
                if (!responseBookingSchedule.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
                setBookingSchedule(dataBookingSchedule);
            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            }
        };
        fetchBookingSchedule();

    }, []);

    return (

        <div>
            <div className={bookAppointmentContentstyles.bookAppointmentContainer}>
                <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainer}>
                    <div className={bookAppointmentContentstyles.innerContainer}>
                        <div className={bookAppointmentContentstyles.appointmentDetails}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                    <g clip-path="url(#clip0_1255_11911)">
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
                        <div className={bookAppointmentContentstyles.innerContainerBox}>
                            <div className={globalStyleCss.header2}>
                                Appointment details
                            </div>
                            <div className={bookAppointmentContentstyles.smsTextContainer}>
                                <div className={globalStyleCss.regular}>An SMS reminder will be sent to you 3 days before the collection date.</div>
                            </div>
                            <div className={bookAppointmentContentstyles.collectionTextContainer}>
                                <span className={bookAppointmentContentstyles.collectionTextSpan}>
                                    <div className={globalStyleCss.regularBold}>
                                        Collection Date
                                    </div>
                                    <div className={globalStyleCss.regular}>
                                        {bookingSchedule?.appointment_date}
                                    </div>
                                </span>

                                <span className={bookAppointmentContentstyles.collectionTextSpan}>
                                    <div className={globalStyleCss.regularBold}>
                                        Collection time slot
                                    </div>
                                    <div className={globalStyleCss.regular}>
                                        {bookingSchedule?.time_start_appointment} - {bookingSchedule?.time_end_appointment}
                                    </div>
                                </span>

                            </div>
                            <div className={bookAppointmentContentstyles.collectionTextContainer}>
                                <span className={bookAppointmentContentstyles.collectionTextSpan}>
                                    <div className={globalStyleCss.regularBold}>
                                        Pass card no.
                                    </div>
                                    <div className={globalStyleCss.regular}>
                                        {bookingSchedule?.passid}
                                    </div>
                                </span>

                                <span className={bookAppointmentContentstyles.collectionTextSpan}>
                                    <div className={globalStyleCss.regularBold}>
                                        Pass card date of expiry
                                    </div>
                                    <div className={globalStyleCss.regular}>
                                        {bookingSchedule?.expired_date}
                                    </div>
                                </span>

                            </div>
                            <div className={bookAppointmentContentstyles.collectionCenterContainer}>
                                <div className={globalStyleCss.regular}>
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
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentCompletePage;
