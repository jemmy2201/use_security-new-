"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import bookAppointmentContentstyles from './BookAppointmentContent.module.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { useFormContext } from '.././FormContext';
import globalStyleCss from '../globalstyle/Global.module.css';

type DisabledDatesResponse = string[];
export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}
const BookAppointmentPage: React.FC = () => {

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const { formData, setFormData } = useFormContext();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const router = useRouter();
    const [users, setUsers] = useState<userInfo>();
    const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);

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



    // Handler for button click to set the selected timeslot
    const handleTimeSlotClick = (text: string) => {
        console.log('timeslot', text);
        setSelectedTimeSlot(text);
        setFormData(prevFormData => ({
            ...prevFormData,
            ['timeSlot']: text,
        }));
    };

    // State variables to store the input values
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');


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
        setFormData(prevFormData => ({
            ...prevFormData,
            ['appointmentDate']: date,
        }));
    };

    // Handler for button click to set the selected timeslot
    const handleButtonClick = (text: string) => {
        console.log('timeslot', text);
        setSelectedTimeSlot(text);
        setFormData(prevFormData => ({
            ...prevFormData,
            ['timeSlot']: text,
        }));
    };

    useEffect(() => {
        const storedData = sessionStorage.getItem('users');
        if (storedData) {
            try {
                const parsedData: userInfo = JSON.parse(storedData);
                setUsers(parsedData);
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }

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


    // Check if a date is disabled
    const isDisabled = (date: Date) => {
        return disabledDates.some(disabledDate => format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    };

    return (
        <form>
            <div className={bookAppointmentContentstyles.mainContainer}>
                <div className={bookAppointmentContentstyles.stepContentContainer}>
                    <div className={globalStyleCss.header2}>
                        Appointment Details
                    </div>

                    <div className={globalStyleCss.regular}>
                        Please choose a date and time to book your appointment to collect your pass card.
                    </div>
                    <div className={bookAppointmentContentstyles.appointmentBox}>
                        <div>
                            <div className={globalStyleCss.regularBold}>
                                Date of appointment
                            </div>
                            <div className={bookAppointmentContentstyles.displayDateTextBox}>
                                <input
                                    type="text"
                                    value={formattedDate}
                                    readOnly
                                />
                            </div>
                            <div className={bookAppointmentContentstyles.displayDateBox}>
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
                                                className={`${bookAppointmentContentstyles.timeSlotText} ${selectedTimeSlot === text ? bookAppointmentContentstyles.selected : ''}`}
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



                <div className={bookAppointmentContentstyles.stepContentContainer}>
                    <div className={globalStyleCss.header2}>
                        Collection Details
                    </div>
                    <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>
                    <div className={bookAppointmentContentstyles.DivStyle}>
                        <div className={bookAppointmentContentstyles.collectionText}>
                            <div className={globalStyleCss.regularBold}>
                                Monday to Friday
                            </div>
                        </div>
                        <div className={bookAppointmentContentstyles.montoFriTimings}>
                            <div className={globalStyleCss.regular}>
                                9:30am - 4:30pm (last walk-in at 4:30pm)</div>
                        </div>
                    </div>
                    <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>

                    <div className={bookAppointmentContentstyles.DivStyle}>
                        <div className={bookAppointmentContentstyles.collectionText}>
                            <div className={globalStyleCss.regularBold}>
                                Last Tuesday of the month & selected eves of Public Holidays (New Year’s Day, Chinese New Year & Christmas Day)
                            </div>
                        </div>
                        <div className={bookAppointmentContentstyles.montoFriTimings}>
                            <div className={globalStyleCss.regular}> 
                                9:30am - 4:30pm (last walk-in at 12:30pm)
                            </div>
                        </div>
                    </div>
                    <hr className={bookAppointmentContentstyles.bookAppointmentBoxLine}></hr>
                    <div>
                        <div className={bookAppointmentContentstyles.collectionText}>
                        <div className={globalStyleCss.regularBold}> Closed on Saturdays, Sundays & Public Holidays </div>
                        </div>
                    </div>



                </div>
            </div>
        </form>
    );
};

export default BookAppointmentPage;
