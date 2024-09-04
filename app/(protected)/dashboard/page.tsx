"use client";

import { useSession } from 'next-auth/react';
import React from 'react';
import DashBoardPage from '../../components/dashboard/DashBoardPage';

const Dashboard: React.FC = () => {

  const { data: session } = useSession();
  console.log("user in session ", session?.user);
  if (!session) {
    return <p>Loading...</p>;
  }

  return (
  <div>
    <h1>Welcome</h1>
    <DashBoardPage />

  </div>
  
  );
};

export default Dashboard;
