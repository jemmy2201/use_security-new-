"use client";

import React from 'react';
import UserInfo from '../components/UserInfo';

const UserInfoPage: React.FC = () => {
    return (
        <div>
            <UserInfo contactNumber="123-456-7890" address="123 Main St, City, Country" />
        </div>
    );
};
export default UserInfoPage;

