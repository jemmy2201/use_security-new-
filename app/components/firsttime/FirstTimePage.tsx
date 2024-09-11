"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import firstTimeContentstyles from './FirstTimeContent.module.css';
import { users as users } from '@prisma/client';
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
}

const FirstTimePage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [users, setUsers] = useState<users>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');

    const handleNewPasscardClick = async () => {
        setLoading(true);
        setError(null);
        try {

            const responseNewPass = await fetch('/api/handle-create-new-pass');
            console.log('response from handle-create-new-pass', responseNewPass);

            const dataNewPass: createNewPassApiResponse = await responseNewPass.json();
            console.log('data:', dataNewPass);
            if (dataNewPass.errorCode) {
                setModalMessage('Failed to fetch data from the server.');
                setShowModal(true); // Show the modal with the message
                return;
            }
            sessionStorage.setItem('createNewPassApiResponse', JSON.stringify(dataNewPass));
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
                        <div className={firstTimeContentstyles.buttonBackground}>
                            <button className={firstTimeContentstyles.buttonText} style={{ textAlign: 'left' }} onClick={handleNewPasscardClick}>
                                Create new pass card
                            </button>
                            {loading && <p>Loading...</p>}
                            {error && <p>{error}</p>}

                            {/* Show modal when `showModal` is true */}
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
