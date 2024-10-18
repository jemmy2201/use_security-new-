"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import receiptContentstyles from './ReceiptContent.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import globalStyleCss from '../globalstyle/Global.module.css';
import { booking_schedules } from '@prisma/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { SO, SSO, SS, SSS, CSO } from '../../constant/constant';
import CircularProgress from '@mui/material/CircularProgress';

interface CompletePageProps {
    bookingId: string;
}

const cardTypeMap: { [key: string]: string } = {
    [SO_APP]: 'Security Officer (SO)  \nAviation Security Officer (AVSO)',
    [PI_APP]: 'Personal Investigator (PI)',
};

const appTypeMap: { [key: string]: string } = {
    [NEW]: 'New',
    [REPLACEMENT]: 'Replace',
    [RENEWAL]: 'Renew',
};

const gradeTypeMap: { [key: string]: string } = {
    [SO]: 'SO',
    [SSO]: 'SSO',
    [SS]: 'SS',
    [SSS]: 'SSS',
    [CSO]: 'CSO',
};

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}

const ReceiptPage: React.FC<CompletePageProps> = ({ bookingId }) => {
    console.log('Booking ID:', bookingId);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();
    const [users, setUsers] = useState<userInfo>();
    const pdfRef = useRef<HTMLDivElement>(null);

    const generatePdf = async () => {
        const input = pdfRef.current;
        if (input) {
            const canvas = await html2canvas(input, {
                scale: window.devicePixelRatio || 2,
                width: input.offsetWidth,
                height: input.offsetHeight,
            });

            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a5');

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width * 0.264583; // Convert px to mm (1px = 0.264583mm)
            const imgHeight = (imgWidth * canvas.height) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight > pageHeight ? pageHeight : imgHeight);
            pdf.save(`${bookingId}.pdf`);
        }
    };

    const formatDate = (dateString: string) => {
        // Split the date and time
        const [datePart] = dateString.split(" ");

        // Split the date part into day, month, and year
        const [day, month, year] = datePart.split("/");

        // Create an array for month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Return the formatted date
        return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
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

    const handleClick = () => {
        router.push('/homepage');
    };

    useEffect(() => {
        setLoading(true);
        const storedData = sessionStorage.getItem('users');
        if (storedData) {
            const actionTypeValue = sessionStorage.getItem('actionTypeValue');
            console.log('Action type value:', typeof actionTypeValue);
            const parsedData: userInfo = JSON.parse(storedData);
            console.log('parsedData userinfo: ', parsedData);
            setUsers(parsedData);
        }

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
        fetchBookingSchedule();
        setLoading(false);
    }, [bookingId, router]);


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
            <div className={receiptContentstyles.container}>

                <div className={receiptContentstyles.innerContainerHeader}>
                    <button type='button' onClick={handleClick} style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_1433_2277)">
                                <path d="M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z" fill="#546E7A" />
                            </g>
                            <defs>
                                <clipPath id="clip0_1433_2277">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div className={globalStyleCss.regularLinkBlackBold}>&nbsp;Back to Home page</div>
                    </button>
                    <div className={globalStyleCss.header1}>
                        Payment receipt
                    </div>
                    <div className={receiptContentstyles.printContainer}>
                        <button type='button' onClick={generatePdf} style={{ display: 'inline-flex', alignItems: 'left' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_1433_4693)">
                                    <path d="M9 12.5H10V10.5H11C11.2833 10.5 11.5208 10.4042 11.7125 10.2125C11.9042 10.0208 12 9.78333 12 9.5V8.5C12 8.21667 11.9042 7.97917 11.7125 7.7875C11.5208 7.59583 11.2833 7.5 11 7.5H9V12.5ZM10 9.5V8.5H11V9.5H10ZM13 12.5H15C15.2833 12.5 15.5208 12.4042 15.7125 12.2125C15.9042 12.0208 16 11.7833 16 11.5V8.5C16 8.21667 15.9042 7.97917 15.7125 7.7875C15.5208 7.59583 15.2833 7.5 15 7.5H13V12.5ZM14 11.5V8.5H15V11.5H14ZM17 12.5H18V10.5H19V9.5H18V8.5H19V7.5H17V12.5ZM8 18C7.45 18 6.97917 17.8042 6.5875 17.4125C6.19583 17.0208 6 16.55 6 16V4C6 3.45 6.19583 2.97917 6.5875 2.5875C6.97917 2.19583 7.45 2 8 2H20C20.55 2 21.0208 2.19583 21.4125 2.5875C21.8042 2.97917 22 3.45 22 4V16C22 16.55 21.8042 17.0208 21.4125 17.4125C21.0208 17.8042 20.55 18 20 18H8ZM8 16H20V4H8V16ZM4 22C3.45 22 2.97917 21.8042 2.5875 21.4125C2.19583 21.0208 2 20.55 2 20V6H4V20H18V22H4Z" fill="#546E7A" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1433_4693">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <div className={globalStyleCss.regular}>&nbsp;Download receipt</div>
                        </button>
                    </div>
                </div>
                <div ref={pdfRef} className={receiptContentstyles.innerContainer}>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.header2}>
                                Transaction details
                            </div>
                        </div>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Transaction reference no.</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>{bookingSchedule?.receiptNo ? bookingSchedule?.receiptNo : bookingSchedule?.receiptNo}</div>
                        </div>
                    </div>
                    <hr className={receiptContentstyles.customhr}></hr>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Transaction date</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}> {formatDate(bookingSchedule?.trans_date ? bookingSchedule.trans_date : '') || ''}</div>
                        </div>
                    </div>

                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Amount paid (inclusive of GST)</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}> S${bookingSchedule?.grand_total}</div>
                        </div>
                    </div>
                    <hr className={receiptContentstyles.customhr}></hr>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Type of application</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular} style={{ whiteSpace: 'pre-line' }}> {appTypeMap[bookingSchedule?.app_type || ''] || 'Unknown'} - {cardTypeMap[bookingSchedule?.card_id || ''] || 'Unknown'}</div>
                        </div>
                    </div>
                    <hr className={receiptContentstyles.customhr}></hr>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Grade</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}> {gradeTypeMap[bookingSchedule?.grade_id || ''] || 'Unknown'}</div>
                        </div>
                    </div>

                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> ID card no.</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.passid}</div>
                        </div>
                    </div>

                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> ID card date of expiry</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}> {formatExpiryDate(bookingSchedule?.expired_date ? bookingSchedule.expired_date : '')} </div>
                        </div>
                    </div>

                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> Full name</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {users?.name}</div>
                        </div>
                    </div>


                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}> NRIC / FIN no.</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {users?.textNric}</div>
                        </div>
                    </div>
                </div>
                <div className={receiptContentstyles.innerContainer}>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.header2}>
                                Appointment details
                            </div>
                        </div>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.warningBox}>
                            <div className={globalStyleCss.regular} style={{ display: 'inline-flex' }}>
                                <svg style={{ display: 'inline-flex' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g clipPath="url(#clip0_1433_2507)">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V16ZM12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9Z" fill="#0277BD" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1433_2507">
                                            <rect width="24" height="24" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <div className={globalStyleCss.regular} >
                                    &nbsp;Please note that the appointment details shown here are from your original booking and will not be updated on this receipt should you reschedule.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection date</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}> {formatAppointmentDate(bookingSchedule?.appointment_date ? bookingSchedule.appointment_date : '') || ''}</div>
                        </div>
                    </div>
                    <hr className={receiptContentstyles.customhr}></hr>
                    <div>
                        <hr className={receiptContentstyles.customhr}></hr>
                    </div>
                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection time slot</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>  {bookingSchedule?.time_start_appointment} - {bookingSchedule?.time_end_appointment}</div>
                        </div>
                    </div>

                    <hr className={receiptContentstyles.customhr}></hr>

                    <div className={receiptContentstyles.receiptTextBox1}>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regularBold}>Collection centre</div>
                        </div>
                        <div className={receiptContentstyles.boxWidth}>
                            <div className={globalStyleCss.regular}>Union of Security Employees (USE)<br></br>
                                200 Jalan Sultan<br></br>
                                #03-24 Textile Centre<br></br>
                                Singapore 199018</div>
                        </div>
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
