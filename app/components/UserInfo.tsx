// components/UserInfo.tsx
"use client";

import React, { useEffect, useState } from 'react';

interface UserInfoProps {
  contactNumber: string;
  address: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ contactNumber, address }) => {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    console.log('Fetching user name from API...');

    async function fetchName() {
      try {
        const res = await fetch('/api/draft');
        const data = await res.json();
        console.log('API response:', data);
        setName(data.name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    }

    fetchName();
  }, []);

  return (
    <div>
      <h1>User Information</h1>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Contact Number:</strong> {contactNumber}</p>
      <p><strong>Address:</strong> {address}</p>
    </div>
  );
};

export default UserInfo;
