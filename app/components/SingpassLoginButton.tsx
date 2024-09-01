import React from 'react';

const SingpassLoginButton: React.FC = () => {
    const handleLogin = () => {
        window.location.href = '/api/singpass/login';
    };

    return (
        <button onClick={handleLogin}>
            Login with Singpass
        </button>
    );
};

export default SingpassLoginButton;
