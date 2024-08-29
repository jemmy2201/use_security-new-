"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import bookAppointmentContentstyles from './BookAppointmentContent.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';


const BookAppointmentPage: React.FC = () => {

    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const router = useRouter();

    // State variables to store the input values
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');


    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<users>();
    const [error, setError] = useState<string | null>(null);

    // Array of button texts
    const buttonTexts = [
        '9:30am - 10:30am',
        '10:30am - 11:30am',
        '11:30am - 12:30pm',
        '12:30pm - 1:30pm',
        '1:30pm - 2:30pm',
        '2:30pm - 3:30pm',
        '3:30pm - 4:30pm',
    ];

    useEffect(() => {
        // Retrieve data from localStorage
        const storedData = localStorage.getItem('users');
        if (storedData) {
            try {
                const parsedData: users = JSON.parse(storedData);
                setUsers(parsedData);
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
    }, []);

    // Handlers for input changes
    const handleContactNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContactNumber(event.target.value);
    };

    return (

        <div>
            <div className={bookAppointmentContentstyles.bookAppointmentContainer}>
                <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainer}>
                    <div className={bookAppointmentContentstyles.applicantDetailsHeaderCard}>
                        <div className={bookAppointmentContentstyles.applicantDetailsHeaderCardContent}>
                            Appointment Details
                        </div>
                        <div className={bookAppointmentContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Please choose a date and time to book your appointment to collect your pass card.
                        </div>
                    </div>
                </div>

                <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainer}>

                    <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainerSide}>
                        <span className={bookAppointmentContentstyles.DivDateContainer}>
                            <div className={bookAppointmentContentstyles.DivDateOfAppintment}>
                                Date of appointment
                            </div>
                            <div className={bookAppointmentContentstyles.DivDate}>
                            <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        inline
        filterDate={date => !isDisabled(date)}
      />                            </div>
                        </span>

                        <span>
                            <div className={bookAppointmentContentstyles.DivDateOfAppintment}>  Time slot </div>
                            <div>
                                <ul>
                                    {buttonTexts.map((text, index) => (
                                        <li key={index} className={bookAppointmentContentstyles.timeSlotLayout}>
                                            <button className={bookAppointmentContentstyles.timeSlotText}>{text}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </span>
                    </div>
                </div>

            </div>



            <div className={bookAppointmentContentstyles.bookAppointmentContainer}>
                <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainer}>
                    <div className={bookAppointmentContentstyles.applicantDetailsHeaderCard}>
                        <div className={bookAppointmentContentstyles.applicantDetailsHeaderCardContent}>
                            Collection Details
                        </div>
                        <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>
                        <div className={bookAppointmentContentstyles.DivStyle}>
                            <span>
                                <div className={bookAppointmentContentstyles.collectionText}>
                                    Monday to Friday
                                </div>
                            </span>
                            <span className={bookAppointmentContentstyles.montoFriTimings}>
                                9:30am - 4:30pm (last walk-in at 4:30pm)
                            </span>
                        </div>
                        <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>

                        <div className={bookAppointmentContentstyles.DivStyle}>
                            <span>
                                <div className={bookAppointmentContentstyles.collectionText}>Last Tuesday of the month & selected eves of Public Holidays (New Year’s Day, Chinese New Year & Christmas Day)
                                </div>
                            </span>
                            <span className={bookAppointmentContentstyles.montoFriTimings}>
                                9:30am - 4:30pm (last walk-in at 12:30pm)
                            </span>
                        </div>
                        <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>
                        <div>
                            <span className={bookAppointmentContentstyles.collectionText}>
                                Closed on Saturdays, Sundays & Public Holidays                            </span>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default BookAppointmentPage;
