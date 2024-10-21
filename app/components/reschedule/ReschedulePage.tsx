"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, } from 'next/navigation';
import rescheduleContentstyles from './RescheduleContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { booking_schedules as bookingDetail } from '@prisma/client';
import globalStyleCss from '../globalstyle/Global.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { booking_schedules } from '@prisma/client';
import CircularProgress from '@mui/material/CircularProgress';
import { getDay, startOfWeek, subWeeks, lastDayOfMonth } from 'date-fns';

type DisabledDatesResponse = string[];

interface ReschedulePageProps {
    bookingId: string;
}

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const buttonTexts = [
    '09:30 - 10:30',
    '10:30 - 11:30',
    '11:30 - 12:30',
    '12:30 - 13:30',
    '13:30 - 14:30',
    '14:30 - 15:30',
    '15:30 - 16:30',
];

const ReschedulePage: React.FC<ReschedulePageProps> = ({ bookingId }) => {
    console.log('ReschedulePage Booking ID:', bookingId);
    const router = useRouter();
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [disabledSlots, setDisabledSlots] = useState<string[]>([]);
    const [disabledSlots2, setDisabledSlots2] = useState<string[]>([]);
    const [disabledSlots3, setDisabledSlots3] = useState<string[]>([]);
    const [startDateError, setStartDateError] = useState<string>("");
    const [selectedTimeSlotError, setSelectedTimeSlotError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState('');
    const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const formatDateSlots = (date: Date | null) => {
        if (!date) return "";
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
    };

    const formattedDate = formatDate(startDate);


    const isFullyBooked = (date: Date) => {
        return fullyBookedDates.some(
            (bookedDate) => bookedDate.toDateString() === date.toDateString()
        );
    };

    const handleDateChange = async (date: Date | null) => {
        setLoading(true);
        setSelectedTimeSlot('');
        setDisabledSlots3([]);
        setDisabledSlots([]);
        setDisabledSlots2([]);
        if (date) {

            const lastDay = lastDayOfMonth(date);
            let dayOfWeek = getDay(lastDay);
            let daysToSubtract = (dayOfWeek >= 2) ? dayOfWeek - 2 : dayOfWeek + 5;
            const lastWednesdayDate = new Date(lastDay);
            lastWednesdayDate.setDate(lastDay.getDate() - daysToSubtract);
            console.log('last tuesday:', format(lastWednesdayDate, 'yyyy-MM-dd'));
            const monthDay = format(date, 'MM-dd');

            if (format(date, 'yyyy-MM-dd') === format(lastWednesdayDate, 'yyyy-MM-dd')
                || monthDay === '01-01' || monthDay === '12-25') {
                setDisabledSlots2(['12:30 - 13:30', '13:30 - 14:30', '14:30 - 15:30', '15:30 - 16:30']);
            }


        }

        setStartDate(date);
        const formattedDateForSlots = formatDateSlots(date);
        const response = await fetch(`/api/day-slots?selectedDate=${encodeURIComponent(formattedDateForSlots)}`);
        if (!response.ok && response.status === 401) {
            router.push('/signin');
            throw new Error('token expired in stripe session');
        }
        const data = await response.json();
        console.log('response, /api/day-slots', data);
        setDisabledSlots(data.disabledSlots);
        const combinedSlots = [...disabledSlots, ...disabledSlots2];
        setDisabledSlots3(combinedSlots);
        setLoading(false);

    };

    useEffect(() => {
        if (startDate) {
            const combinedSlots = [...disabledSlots, ...disabledSlots2];
            setDisabledSlots3(combinedSlots);
        }
    }, [startDate, disabledSlots, disabledSlots2]);

    const handleTimeSlotClick = (text: string) => {
        console.log('timeslot', text);
        setSelectedTimeSlot(text);
    };

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

    const onBack = async () => {

        try {
            setLoading(true);
            const responseUser = await fetch('/api/myinfo');
            if (!responseUser.ok) {
                console.log('no user detail found hence redirecting to firsttime page');
                router.push('/firsttime');
            }
            const dataUser: userInfo = await responseUser.json();

            sessionStorage.setItem('users', JSON.stringify(dataUser));
            console.log('data from api', dataUser);

            const response = await fetch('/api/dashboard');
            if (!response.ok && response.status === 401) {
                router.push('/signin');
                throw new Error('Personal Details: Failed to save draft');
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
        let valid = true;
        try {
            setLoading(true);
            if (!startDate) {
                setStartDateError("Please select the appointment start date");
                valid = false;
            } else {
                setStartDateError("");
            }

            if (!selectedTimeSlot) {
                setSelectedTimeSlotError("Please select the time slot");
                valid = false;
            } else {
                setSelectedTimeSlotError("");
            }
            if (!valid) {
                setLoading(false);
                return;
            }
            const formattedDateForSlots = formatDateSlots(startDate);
            const response = await fetch('/api/reschedule-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    appointmentDate: formattedDateForSlots,
                    timeSlot: selectedTimeSlot,
                }),
            });
            if (!response.ok && response.status === 401) {
                router.push('/signin');
                throw new Error('Personal Details: Failed to save draft');
            }
            const result = await response.json();
            console.log("reschedule: Saved successfully:", result);

            console.log('bookingId', bookingId);
            try {
                const reschedule = bookingSchedule?.appointment_date ? 'Yes' : '';
                router.push(`/complete?bookingId=${encodeURIComponent(bookingId)}&reschedule=${encodeURIComponent(reschedule)}`);
            } catch (err) {
                setErrorMessage('Failed to fetch user details');
            }
        } catch (err) {
            setErrorMessage('Failed to fetch reschedule');
        } finally {
            setLoading(false);
        }
    };
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 769);

    useEffect(() => {

        const fetchBookingSchedule = async () => {
            try {
                setLoading(true);
                const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
                if (!responseBookingSchedule.ok && responseBookingSchedule.status === 401) {
                    setLoading(false);
                    router.push('/signin');
                    throw new Error('Log out');
                }
                if (!responseBookingSchedule.ok) {
                    throw new Error('Network response was not ok');
                }
                const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
                setBookingSchedule(dataBookingSchedule);
            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDisabledDates = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/appointment-dates?bookingId=${encodeURIComponent(bookingId)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch disabled dates');
                }
                const data: DisabledDatesResponse = await response.json();
                const parsedDates = data.map(dateStr => parseISO(dateStr));
                console.log('parsed date:', parsedDates);
                setDisabledDates(parsedDates);

                const responseFullBooked = await fetch("/api/get-fully-booked-dates");
                const dataFullyNooked = await responseFullBooked.json();

                const bookedDates = dataFullyNooked.map((dateStr: string) => new Date(dateStr));
                setFullyBookedDates(bookedDates);

            } catch (error) {
                console.error('Error fetching disabled dates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDisabledDates();
        fetchBookingSchedule();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 769);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            <div className={rescheduleContentstyles.mainContainer}>
                <div className={rescheduleContentstyles.headerBox}>
                    {bookingSchedule && bookingSchedule.appointment_date && (
                        <>
                            <div className={globalStyleCss.header1}>
                                Reschedule Appointment
                                <div className={globalStyleCss.regularBold}>Current appointment is on {formatAppointmentDate(bookingSchedule?.appointment_date ? bookingSchedule.appointment_date : '') || ''}
                                    &nbsp; at {bookingSchedule.time_start_appointment} - {bookingSchedule.time_end_appointment}</div>
                            </div>

                        </>
                    )}

                    {bookingSchedule && !bookingSchedule.appointment_date && (
                        <>
                            <div className={globalStyleCss.header1}>
                                Book Appointment
                            </div>

                        </>
                    )}


                </div>

                <div className={rescheduleContentstyles.appointmentDetailContainer}>
                    <div className={rescheduleContentstyles.header}>
                        <div className={globalStyleCss.header2}>
                            Appointment details
                        </div>
                        <div className={globalStyleCss.regular}>
                            Please choose a date and time to book your appointment to collect your ID card.
                        </div>

                    </div>
                    <div className={rescheduleContentstyles.appointmentBox}>
                        <div style={{
                            width: isMobile ? '100%' : '45%',
                            borderRight: isMobile ? 'none' : '1px solid lightgrey',
                            height: isMobile ? '300px' : '45%',
                        }}>
                            <div className={rescheduleContentstyles.displayHeaderTextBox}>
                                <div className={globalStyleCss.regularBold}>
                                    Date of appointment
                                    {startDateError && <p style={{ color: 'red' }}>{startDateError}</p>}
                                </div>
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
                                    minDate={new Date()}
                                    filterDate={(date) => {
                                        const day = date.getDay();
                                        return day !== 0 && day !== 6;
                                    }}
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

                        <div style={{ width: '45%' }}>

                            <div className={rescheduleContentstyles.displayHeaderTextBox}>
                                <div className={globalStyleCss.regularBold}>
                                    Available Time slot
                                    {selectedTimeSlotError && <p style={{ color: 'red' }}>{selectedTimeSlotError}</p>}
                                </div>
                            </div>
                            <div>
                                <ul>
                                    {buttonTexts.map((text, index) => (
                                        <li key={index}>
                                            <button type='button'
                                                className={`${rescheduleContentstyles.timeSlotText} ${selectedTimeSlot === text
                                                    ? rescheduleContentstyles.selected : ''} ${disabledSlots3.includes(text)
                                                        ? rescheduleContentstyles.disabled : ''}`}
                                                onClick={() => handleTimeSlotClick(text)}
                                                disabled={disabledSlots3.includes(text)}
                                            >
                                                {disabledSlots.includes(text) ? (
                                                    <>
                                                        {text} <br /> Fully Booked
                                                    </>
                                                ) : (
                                                    text
                                                )}
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
                            <div className={globalStyleCss.regularBold}>
                                Last Tuesday of the month & selected eves of Public Holidays (New Year’s Day, Chinese New Year & Christmas Day)
                            </div>
                        </div>
                        <div className={rescheduleContentstyles.montoFriTimings}>
                            <div className={globalStyleCss.regular}> 9:30am - 12:30pm (last walk-in at 12:30pm)
                            </div>
                        </div>
                    </div>
                    <hr className={rescheduleContentstyles.bookAppointmentBoxLine}></hr>
                    <div>
                        <div className={rescheduleContentstyles.collectionText}>
                            Closed on Saturdays, Sundays & Public Holidays
                        </div>
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
