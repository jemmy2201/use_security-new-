"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import firstTimeContentstyles from './FirstTimeContent.module.css';
import FooterPageLink from '../footer/FooterPage'
import HeaderPageLink from '../header/HeaderPage'
import Modal from './Modal';
import CircularProgress from '@mui/material/CircularProgress';

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

const FirstTimePage: React.FC = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [users, setUsers] = useState<userInfo>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const options = [
        <>
          Security Officer(SO)<br />Aviation Security Officer(AVSO)
        </>,
        'Private Investigator(PI)'
      ];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelect = (option: number) => {
        if (option == 1) {
            handleNewPiPasscardClick();
        } else {
            handleNewSoPasscardClick();
        }
        setIsDropdownOpen(false);
    };

    const handleNewSoPasscardClick = async () => {
        setError(null);
        try {
            setLoading(true);
            const responseNewPass = await fetch('/api/handle-create-new-pass/so-card');
            if (!responseNewPass.ok && responseNewPass.status === 401) {
                setLoading(false);
                router.push('/signin');
                throw new Error('Personal Details: Failed to save draft');
            }
            if (!responseNewPass.ok) {
                setLoading(false);
                setShowModal(true);
                return;
            }
            const dataNewPass: createNewPassApiResponse = await responseNewPass.json();

            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(dataNewPass));
            sessionStorage.setItem('actionTypeValue', 'New');

            router.push('/passcard?actionType=New');

        } catch (err) {
            setLoading(false);
            setError('Failed to fetch user details');
        } finally {
            //setLoading(false);
        }
    };

    const handleNewPiPasscardClick = async () => {
        setError(null);
        try {
            setLoading(true);
            const responseNewPass = await fetch('/api/handle-create-new-pass/pi-card');
            if (!responseNewPass.ok && responseNewPass.status === 401) {
                setLoading(false);
                router.push('/signin');
                throw new Error('Personal Details: Failed to save draft');
            }
            if (!responseNewPass.ok) {
                setLoading(false);
                setShowModal(true);
                return;
            }
            const dataNewPass: createNewPassApiResponse = await responseNewPass.json();
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(dataNewPass));
            sessionStorage.setItem('actionTypeValue', 'New');

            router.push('/passcard?actionType=New');

        } catch (err) {
            setLoading(false);
            setError('Failed to fetch user details');
        } finally {
            // setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setModalMessage('');
    };

    useEffect(() => {
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

    }, []);


    return (

        <div style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'column', justifyContent: 'space-between', height: '100%', background:'#F5F6F7' }}>

            {loading && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            )}

            <HeaderPageLink />

            <div className={firstTimeContentstyles.mainContainer}>
                <div className={firstTimeContentstyles.container}>
                    <span className={firstTimeContentstyles.welcome}>
                        Welcome
                    </span>
                    <span className={firstTimeContentstyles.name}>
                        {users?.name}
                    </span>

                </div>
                <div className={firstTimeContentstyles.myApplication}>
                    <div className={firstTimeContentstyles.myApplicationText}>
                        My Applications
                    </div>
                    <div className={firstTimeContentstyles.recordContainer}>
                        <div className={firstTimeContentstyles.recordBox}>
                            <div className={firstTimeContentstyles.recordBoxText}>
                                No Records
                            </div>
                            <div className={firstTimeContentstyles.recordBoxText2} style={{ textAlign: 'center' }}>
                                This is your first application.<br/>
                                To Proceed - Click on &quot;Apply for New ID Card&quot;
                            </div>
                            {/* <div className={firstTimeContentstyles.buttonBackground}>
                            <button className={firstTimeContentstyles.buttonText} style={{ textAlign: 'left' }} onClick={handleNewSoPasscardClick}>
                                Create new SO pass card
                            </button>
                            {showModal && (
                                <Modal message={modalMessage} onClose={handleCloseModal} />
                            )}
                        </div> */}
                            <div className={firstTimeContentstyles.buttonBackground}>
                                {/* <button className={firstTimeContentstyles.buttonText} style={{ textAlign: 'left' }} onClick={handleNewPiPasscardClick}>
                                Create new PI pass card
                            </button> */}

                                <button className={firstTimeContentstyles.buttonText} style={{ textAlign: 'left' }} onClick={toggleDropdown}>
                                Apply for New ID Card
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
                                                key={`ft-${index}`}
                                                onClick={() => handleSelect(index)}
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
                    </div>
                </div>
            </div>

            <div>
                <FooterPageLink />
            </div>
        </div>
    );
};

export default FirstTimePage;
