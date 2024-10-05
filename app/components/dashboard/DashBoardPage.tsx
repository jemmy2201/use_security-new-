"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dashBoardContentstyles from './DashBoardContent.module.css';
import { booking_schedules, booking_schedules as bookingDetail } from '@prisma/client';
import { NEW, REPLACEMENT, RENEWAL } from '../../constant/constant';
import { SO_APP, AVSO_APP, PI_APP } from '../../constant/constant';
import { DRAFT, PROCESSING, READY_FOR_ID_CARD_PRINTING, ID_CARD_READY_FOR_COLLECTION, RESUBMISSION, RESUBMITTED, COMPLETED } from '../../constant/constant';
import { SO, SSO, SS, SSS, CSO } from '../../constant/constant';
import CircularProgress from '@mui/material/CircularProgress';
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
    cardId: string;
    grandTotal: string;
}

export interface userInfo {
    name?: string;
    nric?: string;
    textNric?: string;
    email?: string;
    mobileno?: string;
}


const cardTypeMap: { [key: string]: string } = {
    [SO_APP]: 'Security Officer (SO)/Aviation Security Officer (AVSO)',
    [PI_APP]: 'Personal Investigator',
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

const statusTypeMap: { [key: string]: string } = {
    [DRAFT]: 'Draft',
    [PROCESSING]: 'Processing',
    [READY_FOR_ID_CARD_PRINTING]: 'Ready for printing',
    [ID_CARD_READY_FOR_COLLECTION]: 'Ready for collection',
    [RESUBMISSION]: 'Photo rejected',
    [RESUBMITTED]: 'Resubmitted',
    [COMPLETED]: 'Issued',
};


const DashBoardPage: React.FC = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [users, setUsers] = useState<userInfo>();
    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const options = ['Security Officer (SO)/Aviation Security Officer (AVSO)', 'Private Investigator (PI)'];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelect = (option: string) => {
        console.log('Selected:', option);
        if (option == 'Private Investigator (PI)') {
            handlePINewPasscardClick();
        } else {
            handleSONewPasscardClick();
        }
        setIsDropdownOpen(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleSONewPasscardClick = async () => {
        setError(null);
        try {
            setLoading(true);
            const response = await fetch('/api/handle-create-new-pass/so-card');
            console.log('response from handle-create-new-pass/so-card', response);

            const data: createNewPassApiResponse = await response.json();
            console.log('data:', data);
            if (data.errorCode) {
                setShowModal(true);
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(data));

            // const responseMyInfo = await fetch('/api/myinfo');
            // if (!responseMyInfo.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const dataMyInfo: userInfo = await responseMyInfo.json();
            // router.push('/myinfoterms');
            sessionStorage.setItem('actionTypeValue', 'New');
            router.push('/passcard?actionType=New');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handlePINewPasscardClick = async () => {
        setError(null);
        try {
            setLoading(true);
            const response = await fetch('/api/handle-create-new-pass/pi-card');
            console.log('response from handle-create-new-pass/pi-card', response);

            const data: createNewPassApiResponse = await response.json();
            console.log('data:', data);
            if (data.errorCode) {
                setShowModal(true);
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(data));

            // const responseMyInfo = await fetch('/api/myinfo');
            // if (!responseMyInfo.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const dataMyInfo: userInfo = await responseMyInfo.json();
            // router.push('/myinfoterms');

            sessionStorage.setItem('actionTypeValue', 'New');
            router.push('/passcard?actionType=New');

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



    const handleBookAppointmentClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        const bookingId = id.toString();
        console.log('bookingId', bookingId);
        try {
            router.push(`/reschedule?bookingId=${encodeURIComponent(bookingId)}`);
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePasscardClick = async (id: bigint) => {

        console.log('id', id);
        const bookingId = id.toString(); // Correctly call the toString method
        console.log('bookingId', bookingId);
    };



    const handleResubmitPhotoClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        const bookingId = id.toString(); // Correctly call the toString method
        console.log('bookingId', bookingId);
        try {
            router.push(`/resubmitphoto?bookingId=${encodeURIComponent(bookingId)}`);
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
        const bookingId = id.toString(); // Correctly call the toString method
        console.log('bookingId', bookingId);
        try {
            router.push(`/updatedetails?bookingId=${encodeURIComponent(bookingId)}`);
        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };


    const handleDraftContinuePasscardClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('id', id);
        try {
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: userInfo = await response.json();
            sessionStorage.setItem('users', JSON.stringify(data));
            // Process the data or store it in state/context
            console.log('data from api', data);

            const bookingId = id.toString(); // Replace with your actual bookingId
            const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);

            if (!responseBookingSchedule.ok) {
                throw new Error('Network response was not ok');
            }
            const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
            sessionStorage.setItem('bookingSchedule', JSON.stringify(dataBookingSchedule));
            sessionStorage.setItem('actionTypeValue', 'Edit');
            console.log('booking data from api', dataBookingSchedule);

            router.push('/passcard?actionType=Edit');

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
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: userInfo = await response.json();
            sessionStorage.setItem('users', JSON.stringify(data));

            const bookingId = id.toString();
            const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);

            if (!responseBookingSchedule.ok) {
                throw new Error('Network response was not ok');
            }
            const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
            sessionStorage.setItem('bookingSchedule', JSON.stringify(dataBookingSchedule));
            sessionStorage.setItem('actionTypeValue', 'Replace');
            router.push('/passcard?actionType=Replace');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleRenewClick = async (id: bigint) => {
        setLoading(true);
        setError(null);
        console.log('inside renew,id', id);
        try {
            const response = await fetch('/api/myinfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: userInfo = await response.json();
            sessionStorage.setItem('users', JSON.stringify(data));
            console.log('data from api', data);

            const bookingId = id.toString();
            const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);

            if (!responseBookingSchedule.ok) {
                throw new Error('Network response was not ok');
            }
            const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();

            if (dataBookingSchedule.app_type != '3') {
                setShowModal(true);
                return;
            }
            sessionStorage.setItem('bookingSchedule', JSON.stringify(dataBookingSchedule));
            console.log('booking data from api', dataBookingSchedule);
            sessionStorage.setItem('actionTypeValue', 'Renew');
            router.push('/passcard?actionType=Renew');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        setLoading(true);
        const storedUserData = sessionStorage.getItem('users');
        if (storedUserData) {
            try {
                const parsedUserData: userInfo = JSON.parse(storedUserData);
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
        setLoading(false);

    }, []);


    return (
        <div style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}
            <HeaderPageLink />

            <div className={dashBoardContentstyles.mainContainer}>
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
                                <button onClick={toggleDropdown}>
                                    <div className={globalStyleCss.buttonText}>Apply for new pass card</div>
                                </button>

                                {isDropdownOpen && (
                                    <ul style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        position: 'absolute',
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        zIndex: 1,
                                        width: '250px',
                                        maxHeight: '100px',
                                        overflowY: 'auto'
                                    }}>
                                        {options.map((option, index) => (
                                            <li
                                                key={`op-${index}`}
                                                onClick={() => handleSelect(option)}
                                                style={{
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'normal',
                                                    wordWrap: 'break-word'
                                                }}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>

                                )}

                                {showModal && (
                                    <Modal message={modalMessage} onClose={handleCloseModal} />
                                )}
                            </div>


                        </div>

                        <div className={dashBoardContentstyles.recordContainer}>
                            <table>
                                <thead>
                                    <tr className={globalStyleCss.regularBold}>
                                        <th className={dashBoardContentstyles.item2}>Application type</th>
                                        <th className={dashBoardContentstyles.item}>License type</th>
                                        <th className={dashBoardContentstyles.item1}>Grade</th>
                                        <th className={dashBoardContentstyles.item3}>Collection date</th>
                                        <th className={dashBoardContentstyles.item3}>Application Status</th>
                                        <th className={dashBoardContentstyles.item}>Actions</th>
                                    </tr>
                                    <tr className={dashBoardContentstyles.hrBox}>
                                        <th colSpan={6}>
                                            <br></br>
                                            <hr className={dashBoardContentstyles.hrLine}></hr>
                                            <br></br>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        bookingSchedules.map((booking) =>
                                        (
                                            <>
                                                <tr key={`b-${booking.id}`} className={globalStyleCss.regular}>
                                                    <td className={dashBoardContentstyles.item2}>{booking.app_type == '1' ? 'New' : 'Existing'}</td>
                                                    <td className={dashBoardContentstyles.item}>{cardTypeMap[booking.card_id || ''] || 'Unknown'}</td>
                                                    <td className={dashBoardContentstyles.item1}>{gradeTypeMap[booking.grade_id || ''] || ''}</td>
                                                    <td className={dashBoardContentstyles.item3}>{formatDate(booking.appointment_date ? booking.appointment_date : '') || ''}</td>

                                                    <td className={dashBoardContentstyles.item3}>

                                                        {booking.app_type == '1' ? (
                                                            <>
                                                                {statusTypeMap[booking.Status_app || ''] || ''}
                                                            </>
                                                        ) : null}

                                                        {booking.app_type != '1' && booking.app_type != '3' ? (
                                                            <>
                                                                Issued
                                                            </>
                                                        ) : null}

                                                        {booking.app_type == '3' ? (
                                                            <>
                                                                Renew
                                                            </>
                                                        ) : null}


                                                        {booking.app_type == '3' ? (
                                                            <>
                                                                &nbsp;- {statusTypeMap[booking.Status_app || ''] || ''}

                                                            </>
                                                        ) : null}

                                                    </td>
                                                    <td className={dashBoardContentstyles.item}>


                                                        {booking.app_type == '2' ? (
                                                            <>

                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleReplaceClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Replace &nbsp;&nbsp;
                                                                </a>
                                                                <a
                                                                    href="/renew"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleRenewClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Renew &nbsp;&nbsp;
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleUpdateClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Update
                                                                </a>
                                                            </>

                                                        ) : null}


                                                        {booking.app_type == '3' && !booking.Status_app ? (
                                                            <>
                                                                <a
                                                                    href="/renew"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleRenewClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Renew
                                                                </a>
                                                            </>
                                                        ) : null}

                                                        {booking.Status_app == '0' ? (
                                                            <>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDraftContinuePasscardClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Continue &nbsp;
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeletePasscardClick(booking.id);
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

                                                        {booking.Status_app == '4' ? (
                                                            <>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleResubmitPhotoClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Upload photo &nbsp;
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleViewReceiptClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    View receipt
                                                                </a>
                                                            </>
                                                        ) : null}

                                                        {booking.Status_app == '5' && !booking.appointment_date ? (
                                                            <>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleBookAppointmentClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Book Appointment &nbsp;&nbsp;
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleViewReceiptClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    View Receipt
                                                                </a>
                                                            </>
                                                        ) : null}

                                                        {booking.Status_app == '5' && booking.appointment_date ? (
                                                            <>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleViewReceiptClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    View Receipt
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleBookAppointmentClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    &nbsp; Change Appointment
                                                                </a>

                                                            </>
                                                        ) : null}

                                                        {booking.Status_app == '6' ? (
                                                            <>

                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleRenewClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Renew &nbsp;&nbsp;
                                                                </a>

                                                                {/* <a
                                                                href="/edit"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleRenewClick(booking.id);
                                                                }}
                                                                className={globalStyleCss.blueLink}>
                                                                Renew &nbsp;
                                                            </a> */}
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleReplaceClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Replace &nbsp;&nbsp;
                                                                </a>
                                                                <a
                                                                    href="/edit"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleUpdateClick(booking.id);
                                                                    }}
                                                                    className={globalStyleCss.blueLink}>
                                                                    Update
                                                                </a>
                                                            </>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                                {(booking.Status_app == '1' || booking.Status_app == '5') && booking.appointment_date && (<tr key={booking.passid} style={{ backgroundColor: '#F5F6F7' }}>
                                                    <td colSpan={6} >
                                                        <div className={dashBoardContentstyles.collectionHeader}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <g clipPath="url(#clip0_1402_6733)">
                                                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12V16ZM12 9C11.45 9 11 8.55 11 8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8C13 8.55 12.55 9 12 9Z" fill="#546E7A" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_1402_6733">
                                                                        <rect width="24" height="24" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                            &nbsp;You have made an appointment to collect your new pass card on {formatDate(booking.appointment_date ? booking.appointment_date : '') || ''}, {booking.time_start_appointment} - {booking.time_end_appointment}
                                                        </div>
                                                    </td>
                                                </tr>)}
                                            </>

                                        )

                                        )
                                    }


                                </tbody>
                            </table>



                        </div>


                        {bookingSchedules.map((booking) => (
                            <div key={`bs-${booking.id}`} className={dashBoardContentstyles.recordContainerMobile}>
                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Application type
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {booking.app_type == '1' ? 'New' : 'Existing'}
                                        </div>
                                    </div>
                                </div>

                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Pass card type
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {cardTypeMap[booking.card_id || ''] || 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Grade
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {gradeTypeMap[booking.grade_id || ''] || ''}
                                        </div>
                                    </div>
                                </div>

                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Collection date
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {formatDate(booking.appointment_date ? booking.appointment_date : '') || ''}
                                        </div>
                                    </div>
                                </div>

                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Application status
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {statusTypeMap[booking.Status_app || ''] || 'Unknown'}
                                        </div>
                                    </div>
                                </div>

                                <div className={dashBoardContentstyles.item}>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regularBold}>
                                            Action
                                        </div>
                                    </div>
                                    <div className={dashBoardContentstyles.cell}>
                                        <div className={globalStyleCss.regular}>
                                            {booking.Status_app == '0' ? (
                                                <>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDraftContinuePasscardClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Continue <br></br>
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeletePasscardClick(booking.id);
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
                                                        View Receipt <br></br>
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
                                                        View Receipt <br></br>
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

                                            {booking.Status_app == '4' ? (
                                                <>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleResubmitPhotoClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        Upload photo <br></br>
                                                    </a>
                                                    <a
                                                        href="/edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleViewReceiptClick(booking.id);
                                                        }}
                                                        className={globalStyleCss.blueLink}>
                                                        View receipt
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
                                                        Update <br></br>
                                                    </a>
                                                    {/* <a
                                                    href="/edit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleRenewClick(booking.id);
                                                    }}
                                                    className={globalStyleCss.blueLink}>
                                                    Renew <br></br>
                                                </a> */}
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
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}

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
