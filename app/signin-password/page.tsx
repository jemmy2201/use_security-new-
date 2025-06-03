'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HomeStyle.module.css';
import headerstyles from './HeaderStyle.module.css';
import footerstyles from './FooterStyle.module.css';
import { signIn } from 'next-auth/react';
import s from './signin.module.scss';
import FooterPageLink from '../components/footer/FooterPage';
import globalStyleCss from '../components/globalstyle/Global.module.css';
import Link from 'next/link';
import Image from 'next/image';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [startDateError, setStartDateError] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build the form data
    const formData = {
      username,
      password,
    };

    try {
      // Send a POST request to the API
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        router.push('/terms');
      } else {
        setStartDateError(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={headerstyles.headerContainer}>
          <div className={headerstyles.logo}>
            <Image src='/images/logo.png' alt='Logo' width={55} height={58} />
          </div>
          <div className={headerstyles.companyName}>
            Union of Security Employees (USE)
          </div>
          <div className={headerstyles.leftBox}>
            <Image
              src='/images/contact-icon.svg'
              alt='Contact'
              width={20}
              height={20}
              className={headerstyles.contactIcon}
            />
            <div className={headerstyles.contactUs}>
              <Link href='/contactus'>Contact Us</Link>
            </div>
          </div>
        </div>

        <div className={s.bodyBox}>
          <div className={s.title}>Welcome to USE ID Card Portal </div>
          <form onSubmit={handleSubmit}>
            <div className={s.loginBox}>
              <label htmlFor='username'>User Name:&nbsp;</label>
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ color: 'black' }}
              />{' '}
            </div>
            <div className={s.loginBox}>
              <label htmlFor='password'>&nbsp;&nbsp;Password:&nbsp;</label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ color: 'black' }}
              />{' '}
            </div>
            <div className={s.loginBox}>
              <button type='submit' className={headerstyles.loginButton}>
                <div className={globalStyleCss.primaryButton}>Log in</div>
              </button>
              {startDateError && (
                <p style={{ color: 'red' }}>{startDateError}</p>
              )}
            </div>
          </form>
        </div>

        <FooterPageLink />
      </div>
    </div>
  );
};

export default HomePage;
