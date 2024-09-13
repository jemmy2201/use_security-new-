"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import receiptContentstyles from './ReceiptContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import globalStyleCss from '../globalstyle/Global.module.css';
import { booking_schedules } from '@prisma/client';

interface CompletePageProps {
    bookingId: string;
}

const ReceiptPage: React.FC<CompletePageProps> = ({ bookingId }) => {
    console.log('Booking ID:', bookingId);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();

    useEffect(() => {
        const fetchBookingSchedule = async () => {
            try {
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

        <form>
            <div >
                <HeaderPageLink />
            </div>
            <div className={receiptContentstyles.container}>
                <div className={globalStyleCss.header1}>
                    Payment receipt
                </div>
                <div className={receiptContentstyles.innerContainer}>
                    <div className={receiptContentstyles.appointmentDetails}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.header2}>
                                Transaction details
                            </div>
                        </div>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Transaction reference no.</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>{bookingSchedule?.stripe_payment_id}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Transaction date</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.data_barcode_paynow}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Amount paid (inclusive of GST)</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.grand_total}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Type of application</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.app_type}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Grade</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.grade_id}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Pass card no.</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.passid}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Pass card date of expiry</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.expired_date}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Full name</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.nric}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>                    
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> NRIC / FIN no.</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.nric}</div>
                        </span>
                    </div>
                </div>
                <div className={receiptContentstyles.innerContainer}>
                    <div className={receiptContentstyles.appointmentDetails}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.header2}>
                                Appointment details
                            </div>
                        </div>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection date</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>{bookingSchedule?.appointment_date}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div> 
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection time slot</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.time_start_appointment} - {bookingSchedule?.time_end_appointment}</div>
                        </span>
                    </div>
                    <div>                    
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div> 
                    <div className={receiptContentstyles.receiptTextBox}>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection centre</div>
                        </span>
                        <span className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>Union of Security Employees (USE)<br></br>
                                200 Jalan Sultan<br></br>
                                #03-24 Textile Centre<br></br>
                                Singapore 199018</div>
                        </span>
                    </div>

                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </form>
    );
};

export default ReceiptPage;
