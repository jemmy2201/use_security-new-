"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import firstTimeContentstyles from './FirstTimeContent.module.css';
import FooterPageLink from '../footer/FooterPage'
import HeaderPageLink from '../header/HeaderPage'
import Modal from './Modal';

export interface createNewPassApiResponse {
    errorCode?: string;
    errorMessage?: string;
    canCreateSoApplication?: boolean;
    canCreatePiApplication?: boolean;
    canCreateAvsoApplication?: boolean;
    passId?: string;
    recordId: string;
    cardId: string;
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

    const options = ['Security Officer (SO)/Aviation Security Officer (AVSO)', 'Private Investigator (PI)'];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelect = (option: string) => {
        console.log('Selected:', option);
        if (option == 'Private Investigator (PI)') {
            handleNewPiPasscardClick();
        } else {
            handleNewSoPasscardClick();
        }
        setIsDropdownOpen(false);
    };

    const handleNewSoPasscardClick = async () => {
        setLoading(true);
        setError(null);
        try {

            // const response = await fetch('/api/myinfo');
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const data: users = await response.json();
            // sessionStorage.setItem('users', JSON.stringify(data));

            const responseNewPass = await fetch('/api/handle-create-new-pass/so-card');
            console.log('response from handle-create-new-pass', responseNewPass);

            const dataNewPass: createNewPassApiResponse = await responseNewPass.json();
            console.log('data:', dataNewPass);
            if (dataNewPass.errorCode) {
                setShowModal(true);
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(dataNewPass));
            // const responseMyInfo = await fetch('/api/myinfo');
            // if (!responseMyInfo.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const dataMyInfo: users = await responseMyInfo.json();
            // router.push('/myinfoterms');

            sessionStorage.setItem('actionTypeValue', 'New');

            router.push('/passcard?actionType=New');

        } catch (err) {
            setError('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    };

    const handleNewPiPasscardClick = async () => {
        setLoading(true);
        setError(null);
        try {

            const responseNewPass = await fetch('/api/handle-create-new-pass/pi-card');
            console.log('response from handle-create-new-pass', responseNewPass);

            const dataNewPass: createNewPassApiResponse = await responseNewPass.json();
            console.log('data:', dataNewPass);
            if (dataNewPass.errorCode) {
                setShowModal(true);
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(dataNewPass));
            // const responseMyInfo = await fetch('/api/myinfo');
            // if (!responseMyInfo.ok) {
            //     throw new Error('Network response was not ok');
            // }
            // const dataMyInfo: users = await responseMyInfo.json();
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

        <div className={firstTimeContentstyles.mainContainer}>
            <div >
                <HeaderPageLink />
            </div>

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
                    My applications
                </div>
                <div className={firstTimeContentstyles.recordContainer}>
                    <div className={firstTimeContentstyles.recordBox}>
                        <div className={firstTimeContentstyles.recordBoxText}>
                            No records
                        </div>
                        <div className={firstTimeContentstyles.recordBoxText2}>
                            Your application will be displayed here
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
                                Apply for new pass card
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
                                            key={index}
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
                </div>
            </div>

            <div>
                <FooterPageLink />
            </div>
        </div>

    );
};

export default FirstTimePage;
