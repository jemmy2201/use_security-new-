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

type DisabledDatesResponse = string[]; // Array of ISO date strings

interface ReschedulePageProps {
    bookingId: string;
}

const ReschedulePage: React.FC<ReschedulePageProps> = ({ bookingId }) => {
    console.log('ReschedulePage Booking ID:', bookingId);

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
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

    // Function to handle date change
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    // Handler for button click to set the selected timeslot
    const handleTimeSlotClick = (text: string) => {
        console.log('timeslot', text);
        setSelectedTimeSlot(text);
    };

    const onBack = () => {

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
            <div className={rescheduleContentstyles.container}>
                <div className={globalStyleCss.header1}>
                    Reschedule Appointment
                </div>
                <div className={rescheduleContentstyles.innerContainer}>
                    <div className={rescheduleContentstyles.appointmentDetails}>
                        <div className={globalStyleCss.header2}>
                            Appointment details
                        </div>
                        <div className={globalStyleCss.regular}>
                            Please choose a date and time to book your appointment to collect your pass card.
                        </div>
                    </div>
                </div>
                <div className={rescheduleContentstyles.bookAppointmentContainer}>
                    <div className={rescheduleContentstyles.bookAppointmentDetailsContainer}>
                        <div className={rescheduleContentstyles.bookAppointmentDetailsContainerSide}>
                            <span className={rescheduleContentstyles.DivDateContainer}>
                                <div className={rescheduleContentstyles.DivDateOfAppintment}>
                                    Date of appointment
                                </div>
                                <div>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleDateChange}
                                        dateFormat="yyyy-MM-dd"
                                        isClearable
                                        placeholderText="Choose a date"
                                        excludeDates={disabledDates}
                                    />
                                </div>
                            </span>

                            <span>
                                <div className={rescheduleContentstyles.DivDateOfAppintment}>
                                    <div className={globalStyleCss.regularBold}>
                                        Available Time slot
                                    </div>
                                </div>

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

                            </span>
                        </div>
                    </div>
                </div>

                <div className={rescheduleContentstyles.bookAppointmentContainer}>
                    <div className={rescheduleContentstyles.bookAppointmentDetailsContainer}>
                        <div className={rescheduleContentstyles.applicantDetailsHeaderCard}>
                            <div className={globalStyleCss.header2}>
                                Collection Details
                            </div>
                            <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>
                            <div className={rescheduleContentstyles.DivStyle}>
                                <span className={rescheduleContentstyles.collectionText}>
                                    <div className={globalStyleCss.regularBold}>
                                        Monday to Friday
                                    </div>
                                </span>
                                <span className={rescheduleContentstyles.montoFriTimings}>
                                    <div className={globalStyleCss.regular}>
                                        9:30am - 4:30pm (last walk-in at 4:30pm)</div>
                                </span>
                            </div>
                            <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>

                            <div className={rescheduleContentstyles.DivStyle}>
                                <span className={rescheduleContentstyles.collectionText}>
                                    <div className={globalStyleCss.regularBold}>Last Tuesday of the month & selected eves of Public Holidays (New Year’s Day, Chinese New Year & Christmas Day)
                                    </div>
                                </span>
                                <span className={rescheduleContentstyles.montoFriTimings}>
                                    <div className={globalStyleCss.regular}> 9:30am - 4:30pm (last walk-in at 12:30pm)
                                    </div>
                                </span>
                            </div>
                            <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>
                            <div>
                                <span className={rescheduleContentstyles.collectionText}>
                                    Closed on Saturdays, Sundays & Public Holidays
                                </span>

                            </div>
                        </div>
                    </div>
                </div>

                <div className={rescheduleContentstyles.buttonContainer}>
                    <button className={rescheduleContentstyles.saveDraft} onClick={onBack} style={{ marginRight: '10px' }}>
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
