// pages/auth/callback.tsx
import React, { useEffect } from 'react';  // Import React
import { useRouter } from 'next/router';
import axios from 'axios';

const CallbackPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const { code } = router.query;

            if (code) {
                try {
                    const response = await axios.post('/api/singpass/login', { code });
                    const { id_token } = response.data;

                    // Save ID token in local storage or context
                    localStorage.setItem('id_token', id_token);
                    router.push('/home'); // Redirect to home or desired page
                } catch (error) {
                    console.error('Callback error:', error);
                }
            }
        };

        handleCallback();
    }, [router.query]);

    return <div>Loading...</div>;
};

export default CallbackPage;
