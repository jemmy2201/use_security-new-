// "use client";

import { cookies } from 'next/headers'
import React from 'react';
import TermsPage from '../../components/terms/TermsPage';
import { decrypt } from '../../../lib/session';

const Terms: React.FC = async () => {



  const getSession = async () => {
    const cookie = cookies().get('session')?.value;

    console.log('cookie', cookie);
    const session = await decrypt(cookie)
    console.log('session', session);
    return session;
  }

  const s = await getSession();
  console.log('s============', s)

  return (
    <div>
      <TermsPage />
    </div>

  );
};

export default Terms;
