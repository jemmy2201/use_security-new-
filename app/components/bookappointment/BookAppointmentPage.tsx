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

type DisabledDatesResponse = string[]; // Array of ISO date strings

const BookAppointmentPage: React.FC = () => {

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
                const parsedData: users = JSON.parse(storedData);
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
                            <div className={bookAppointmentContentstyles.DivDateOfAppintment}>  Time slot </div>
                            <div>
                                <ul>
                                    {buttonTexts.map((text, index) => (
                                        <li key={index} className={bookAppointmentContentstyles.timeSlotLayout}>
                                            <button
                                                className={`${bookAppointmentContentstyles.timeSlotText} ${selectedTimeSlot === text ? bookAppointmentContentstyles.selected : ''}`}
                                                onClick={() => handleButtonClick(text)}
                                            >
                                                {text}
                                            </button>
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
