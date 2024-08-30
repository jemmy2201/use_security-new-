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

type DisabledDatesResponse = string[]; // Array of ISO date strings

const BookAppointmentCompletePage: React.FC = () => {

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

    return (

        <div>
            <div className={bookAppointmentContentstyles.bookAppointmentContainer}>
                <div className={bookAppointmentContentstyles.bookAppointmentDetailsContainer}>
                    <div className={bookAppointmentContentstyles.applicantDetailsHeaderCard}>
                        <div className={bookAppointmentContentstyles.applicantDetailsHeaderCardContent}>
                            <h1>Appointment successfully booked</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentCompletePage;
