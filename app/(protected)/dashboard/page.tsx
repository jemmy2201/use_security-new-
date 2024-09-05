"use client";

import React from 'react';
import DashBoardPage from '../../components/dashboard/DashBoardPage';

const Dashboard: React.FC = () => {

  // const { data: session } = useSession();
  // console.log("user in session ", session?.user);

  return (
  <div>
    <DashBoardPage />
  </div>

  );
};

export default Dashboard;
