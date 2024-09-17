"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import rescheduleContentstyles from './RescheduleContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

type DisabledDatesResponse = string[]; // Array of ISO date strings

interface ReschedulePageProps {
    bookingId: string;
}

const buttonTexts = [
    '9:30am - 10:30am',
    '10:30am - 11:30am',
    '11:30am - 12:30pm',
    '12:30pm - 1:30pm',
    '1:30pm - 2:30pm',
    '2:30pm - 3:30pm',
    '3:30pm - 4:30pm',
];

const ReschedulePage: React.FC<ReschedulePageProps> = ({ bookingId }) => {
    console.log('ReschedulePage Booking ID:', bookingId);
    const router = useRouter();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' }); // e.g., "September"
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    const formattedDate = formatDate(startDate);

    const isFullyBooked = (date: Date) => {
        return fullyBookedDates.some(
            (bookedDate) => bookedDate.toDateString() === date.toDateString()
        );
    };

    // Function to handle date change
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    // Handler for button click to set the selected timeslot
    const handleTimeSlotClick = (text: string) => {
        console.log('timeslot', text);
        setSelectedTimeSlot(text);
    };

    const onBack = async () => {

        try {
            const responseUser = await fetch('/api/myinfo');
            if (!responseUser.ok) {
                console.log('no user detail found hence redirecting to firsttime page');
                router.push('/firsttime');
            }
            const dataUser: users = await responseUser.json();

            sessionStorage.setItem('users', JSON.stringify(dataUser));
            console.log('data from api', dataUser);

            const response = await fetch('/api/dashboard');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: bookingDetail[] = await response.json();
            console.log('booking card list: ', data.length);
            if (data.length === 0) {
                console.log('No booking details found.');
                router.push('/firsttime');
            } else {
                sessionStorage.setItem('bookingSchedules', JSON.stringify(data));
                console.log('data from api', data);
                router.push('/dashboard');
            }
        } catch (err) {
            setErrorMessage('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const onNext = async () => {
        try {
            const response = await fetch('/api/reschedule-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    appointmentDate: startDate,
                    timeSlot: selectedTimeSlot,
                }),
            });
            if (!response.ok) {
                throw new Error('reschedule: Failed to save');
            }
            const result = await response.json();
            console.log("reschedule: Saved successfully:", result);

            console.log('bookingId', bookingId);
            try {
                router.push(`/complete?bookingId=${encodeURIComponent(bookingId)}`);
            } catch (err) {
                setError('Failed to fetch user details');
            } finally {
                setLoading(false);
            }
        } catch (err) {
            setError('Failed to fetch reschedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchDisabledDates = async () => {
            try {
                const response = await fetch('/api/appointment-dates'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch disabled dates');
                }
                const data: DisabledDatesResponse = await response.json();
                const parsedDates = data.map(dateStr => parseISO(dateStr));
                setDisabledDates(parsedDates);

                const responseFullBooked = await fetch("/api/get-fully-booked-dates");
                const dataFullyNooked = await responseFullBooked.json();

                // Assuming the API returns dates in ISO format
                const bookedDates = dataFullyNooked.map((dateStr: string) => new Date(dateStr));
                setFullyBookedDates(bookedDates);

            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            }
        };
        fetchDisabledDates();
    }, []);

    return (

        <form>
            <div >
                <HeaderPageLink />
            </div>
            <div className={rescheduleContentstyles.mainContainer}>
                <div className={rescheduleContentstyles.headerBox}>
                    <div className={globalStyleCss.header1}>
                        Reschedule Appointment
                    </div>
                </div>

                <div className={rescheduleContentstyles.appointmentDetailContainer}>
                    <div className={rescheduleContentstyles.header}>
                        <div className={globalStyleCss.header1}>
                            Appointment details
                        </div>
                        <div className={globalStyleCss.regular}>
                            Please choose a date and time to book your appointment to collect your pass card.
                        </div>
                    </div>
                    <div className={rescheduleContentstyles.appointmentBox}>
                        <div>
                            <div className={globalStyleCss.regularBold}>
                                Date of appointment
                            </div>
                            <div className={rescheduleContentstyles.displayDateTextBox}>
                                <input
                                    type="text"
                                    value={formattedDate}
                                    readOnly
                                />
                            </div>
                            <div className={rescheduleContentstyles.displayDateBox}>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    placeholderText="Choose a date"
                                    excludeDates={disabledDates}
                                    renderDayContents={(day, date) => {
                                        const isBooked = isFullyBooked(date);
                                        return (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <span>{day}</span>
                                                {isBooked && (
                                                    <div style={{ fontSize: "8px", color: "red", marginTop: "0px" }}>
                                                        Full
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }}
                                    inline
                                />
                            </div>
                        </div>

                        <div>
                            <div className={globalStyleCss.regularBold}>
                                Available Time slot
                            </div>
                            <div>
                                <ul>
                                    {buttonTexts.map((text, index) => (
                                        <li key={index}>
                                            <button type='button'
                                                className={`${rescheduleContentstyles.timeSlotText} ${selectedTimeSlot === text ? rescheduleContentstyles.selected : ''}`}
                                                onClick={() => handleTimeSlotClick(text)}
                                            >
                                                {text}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={rescheduleContentstyles.appointmentDetailContainer}>
                    <div className={globalStyleCss.header2}>
                        Collection Details
                    </div>
                    <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>
                    <div className={rescheduleContentstyles.DivStyle}>
                        <div className={rescheduleContentstyles.collectionText}>
                            <div className={globalStyleCss.regularBold}>
                                Monday to Friday
                            </div>
                        </div>
                        <div className={rescheduleContentstyles.montoFriTimings}>
                            <div className={globalStyleCss.regular}>
                                9:30am - 4:30pm (last walk-in at 4:30pm)</div>
                        </div>
                    </div>
                    <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>

                    <div className={rescheduleContentstyles.DivStyle}>
                        <div className={rescheduleContentstyles.collectionText}>
                            <div className={globalStyleCss.regularBold}>Last Tuesday of the month & selected eves of Public Holidays (New Year’s Day, Chinese New Year & Christmas Day)
                            </div>
                        </div>
                        <div className={rescheduleContentstyles.montoFriTimings}>
                            <div className={globalStyleCss.regular}> 9:30am - 4:30pm (last walk-in at 12:30pm)
                            </div>
                        </div>
                    </div>
                    <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>
                    <div>
                        <span className={rescheduleContentstyles.collectionText}>
                            Closed on Saturdays, Sundays & Public Holidays
                        </span>
                    </div>
                </div>

                <div className={rescheduleContentstyles.buttonContainer}>
                    <button className={rescheduleContentstyles.saveDraft} type='button' onClick={onBack} style={{ marginRight: '10px' }}>
                        <div className={globalStyleCss.regular}>Cancel</div>
                    </button>
                    <button className={rescheduleContentstyles.continue} type='button' onClick={onNext}>
                        <div className={globalStyleCss.buttonText}>Confirm appointment</div>
                    </button>
                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default ReschedulePage;
