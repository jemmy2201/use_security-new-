"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dashBoardContentstyles from './DashBoardContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { DRAFT, PROCESSING, READY_FOR_ID_CARD_PRINTING, ID_CARD_READY_FOR_COLLECTION, RESUBMISSION, RESUBMITTED, COMPLETED } from '../../constant/constant';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import Modal from '../model/Modal';
import globalStyleCss from '../globalstyle/Global.module.css';

export interface createNewPassApiResponse {
    errorCode?: string;
    errorMessage?: string;
    canCreateSoApplication?: boolean;
    canCreatePiApplication?: boolean;
    canCreateAvsoApplication?: boolean;
    passId?: string;
    recordId: string;
}

const cardTypeMap: { [key: string]: string } = {
    [SO_APP]: 'Security Officer (SO)',
    [AVSO_APP]: 'Aviation Security Officer',
    [PI_APP]: 'Personal Investigator',
};

const appTypeMap: { [key: string]: string } = {
    [NEW]: 'New',
    [REPLACEMENT]: 'Replace',
    [RENEWAL]: 'Renew',
};

const statusTypeMap: { [key: string]: string } = {
    [DRAFT]: 'DRAFT',
    [PROCESSING]: 'PROCESSING',
    [READY_FOR_ID_CARD_PRINTING]: 'READY_FOR_ID_CARD_PRINTING',
    [ID_CARD_READY_FOR_COLLECTION]: 'ID_CARD_READY_FOR_COLLECTION',
    [RESUBMISSION]: 'RESUBMISSION',
    [RESUBMITTED]: 'RESUBMITTED',
    [COMPLETED]: 'Issued',
};


const DashBoardPage: React.FC = () => {

    const [users, setUsers] = useState<users>();
    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');


    const handleNewPasscardClick = async () => {
        setLoading(true);
        setError(null);
        try {

            // const myInfoResponse = await fetch('/api/singpass-myinfo');
            // if (!myInfoResponse.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const myInfoData: string = await myInfoResponse.json();
            // console.log('myInfoData: ', myInfoData);

            // const response = await fetch('/api/myinfo');
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const data: users = await response.json();

            // sessionStorage.setItem('users', JSON.stringify(data));

            // // Process the data or store it in state/context
            // console.log('data from api', data);

            // // Navigate to the dashboard with query parameters or state
            // router.push('/myinfoterms');


            const response = await fetch('/api/handle-create-new-pass');
            console.log('response from handle-create-new-pass', response);

            const data: createNewPassApiResponse = await response.json();
            console.log('data:', data);
            if (data.errorCode) {
                setModalMessage('Failed to fetch data from the server.');
                setShowModal(true); // Show the modal with the message
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(data));

            const responseMyInfo = await fetch('/api/myinfo');
            if (!responseMyInfo.ok) {
                throw new Error('Network response was not ok');
            }
            const dataMyInfo: users = await responseMyInfo.json();
            router.push('/myinfoterms');


        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setModalMessage('');
    };

    const handleEditPasscardClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: users = await response.json();
            sessionStorage.setItem('users', JSON.stringify(data));
            // Process the data or store it in state/context
            console.log('data from api', data);

            const bookingId = id.toString(); // Replace with your actual bookingId
            const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);

            if (!responseBookingSchedule.ok) {
                throw new Error('Network response was not ok');
            }
            const dataBookingSchedule: users = await responseBookingSchedule.json();
            sessionStorage.setItem('bookingSchedule', JSON.stringify(dataBookingSchedule));
            // Process the data or store it in state/context
            console.log('booking data from api', dataBookingSchedule);

            // Navigate to the dashboard with query parameters or state
            router.push('/passcard');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointmentClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        const bookingId = id.toString(); // Correctly call the toString method
        console.log('bookingId', bookingId);
        try {
            router.push(`/reschedule?bookingId=${encodeURIComponent(bookingId)}`);
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };


    const handleViewReceiptClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        const bookingId = id.toString(); // Correctly call the toString method
        console.log('bookingId', bookingId);

        // const response = await fetch('/api/generate-pdf?bookingId=${bookingId}');
        // const blob = await response.blob();
        // const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = 'generated.pdf';
        // link.click();

        try {
            router.push(`/receipt?bookingId=${encodeURIComponent(bookingId)}`);
        } catch (err) {
            setError('Failed to load receipt page');
        } finally {
            setLoading(false);
        }

    };

    const handleUpdateClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {


        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleRenewClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {


        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {


        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('users');
        if (storedUserData) {
            try {
                const parsedUserData: users = JSON.parse(storedUserData);
                setUsers(parsedUserData);
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }

        const storedData = sessionStorage.getItem('bookingSchedules');
        if (storedData) {
            try {
                const parsedData: bookingDetail[] = JSON.parse(storedData);
                setBookingSchedules(parsedData);
            } catch (err) {
                setError('Failed to parse user data');
            }
        } else {
            setError('No user data found');
        }
    }, []);


    return (

        <div className={dashBoardContentstyles.mainContainer}>

            <div >
                <HeaderPageLink />
            </div>
            <div className={dashBoardContentstyles.container}>
                <div className={globalStyleCss.regularBoldWhite}>
                    Welcome
                </div>
                <div className={globalStyleCss.header1White}>
                    {users?.name}
                </div>
            </div>

            <div className={dashBoardContentstyles.centerBox}>
                <div className={dashBoardContentstyles.myApplication}>
                    <div className={dashBoardContentstyles.headerBox}>
                        <div className={globalStyleCss.header1}>
                            My applications
                        </div>

                        <div className={dashBoardContentstyles.primaryButton}>
                            <button onClick={handleNewPasscardClick}>
                                <div className={globalStyleCss.buttonText}>Apply for new pass</div>
                            </button>
                            {loading && <p>Loading...</p>}
                            {error && <p>{error}</p>}

                            {/* Show modal when `showModal` is true */}
                            {showModal && (
                                <Modal message={modalMessage} onClose={handleCloseModal} />
                            )}
                        </div>
                    </div>

                    <div className={dashBoardContentstyles.recordContainer}>
                        <table>
                            <thead>
                                <tr className={globalStyleCss.regularBold}>
                                    <th className={dashBoardContentstyles.item}>Application type</th>
                                    <th className={dashBoardContentstyles.item}>Pass card type</th>
                                    <th className={dashBoardContentstyles.item}>Grade</th>
                                    <th className={dashBoardContentstyles.item}>Collection date</th>
                                    <th className={dashBoardContentstyles.item}>Application Status</th>
                                    <th className={dashBoardContentstyles.item}>Actions</th>
                                </tr>

                            </thead>
                            <tbody>
                                {bookingSchedules.map((booking) => (
                                    <tr className={globalStyleCss.regular}>
                                        <td className={dashBoardContentstyles.item} key={booking.app_type}>{appTypeMap[booking.app_type || ''] || 'Unknown'}</td>
                                        <td className={dashBoardContentstyles.item} key={booking.card_id}>{cardTypeMap[booking.card_id || ''] || 'Unknown'}</td>
                                        <td className={dashBoardContentstyles.item} key={booking.grade_id}>{booking.grade_id}</td>
                                        <td className={dashBoardContentstyles.item} key={booking.trans_date}>{booking.appointment_date}</td>
                                        <td className={dashBoardContentstyles.item} key={booking.Status_app}>{statusTypeMap[booking.Status_app || ''] || 'Unknown'}</td>
                                        <td className={dashBoardContentstyles.item}>
                                            {booking.Status_app == '0' ? (
                                                <>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleEditPasscardClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Continue
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleNewPasscardClick();
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Delete
                                                    </a>
                                                </>
                                            ) : null}


                                            {booking.Status_app == '1'
                                                && booking.status_payment
                                                && !booking.appointment_date ? (
                                                <>

                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleViewReceiptClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        View Receipt &nbsp;
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleBookAppointmentClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Book Appointment
                                                    </a>
                                                </>
                                            ) : null}


                                            {(booking.Status_app == '1' || booking.Status_app == '2') && booking.appointment_date ? (
                                                <>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleViewReceiptClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        View Receipt &nbsp;
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleBookAppointmentClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Change Appointment
                                                    </a>
                                                </>
                                            ) : null}

                                            {booking.Status_app == '6' ? (
                                                <>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleUpdateClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Update
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleRenewClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Renew
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleReplaceClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Replace
                                                    </a>
                                                </>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
            <div>
                <FooterPageLink />
            </div>
        </div>
    );
};

export default DashBoardPage;
