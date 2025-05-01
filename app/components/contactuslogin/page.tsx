'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import contactusContentstyles from './ContactusContent.module.scss';
import globalStyleCss from '../globalstyle/Global.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const ContactusPage: React.FC = () => {
  const router = useRouter();

  const handleLoginClick = async () => {
    signIn('singpass');
  };

  const handleClick = () => {
    router.push('/homepage');
  };

  return (
    <form>
      <div>
        <HeaderPageLink />
      </div>
      <div className={contactusContentstyles.mainContainer}>
        <div className={contactusContentstyles.contactusContainer}>
          <button
            type='button'
            onClick={handleClick}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
            >
              <g clipPath='url(#clip0_1433_2277)'>
                <path
                  d='M7.825 13L13.425 18.6L12 20L4 12L12 4L13.425 5.4L7.825 11H20V13H7.825Z'
                  fill='#546E7A'
                />
              </g>
              <defs>
                <clipPath id='clip0_1433_2277'>
                  <rect width='24' height='24' fill='white' />
                </clipPath>
              </defs>
            </svg>
            <div className={globalStyleCss.regularLinkBlackBold}>
              &nbsp;Back to Home page
            </div>
          </button>
          <div className={globalStyleCss.header2}>Contact Us</div>

          <div className={contactusContentstyles.bodyContainer}>
            <div className={globalStyleCss.header2}>
              Union of Security Employees (USE)
            </div>

            <hr className={contactusContentstyles.hrLine}></hr>
            <div className={contactusContentstyles.box1}>
              <div className={contactusContentstyles.leftText}>
                <div className={globalStyleCss.regularBold}>
                  Customer Service Centre
                </div>
              </div>
              <div className={contactusContentstyles.rightText}>
                <div className={globalStyleCss.regular}>
                  +65 6381 9150<br></br>+65 6291 5145
                </div>
              </div>
            </div>
            <hr className={contactusContentstyles.hrLine}></hr>
            <div className={contactusContentstyles.box1}>
              <div className={contactusContentstyles.leftText}>
                <div className={globalStyleCss.regularBold}>Email</div>
              </div>
              <div className={contactusContentstyles.rightText}>
                <div className={globalStyleCss.regular}>
                  use-idcard@ntuc.org.sg
                </div>
              </div>
            </div>
            <hr className={contactusContentstyles.hrLine}></hr>
            <div className={contactusContentstyles.box1}>
              <div className={contactusContentstyles.leftText}>
                <div className={globalStyleCss.regularBold}>Location</div>
              </div>
              <div className={contactusContentstyles.rightText}>
                <div className={globalStyleCss.regular}>
                  Union of Security Employees (USE)
                  <br></br>200 Jalan Sultan
                  <br></br>#03-24 Textile Centre
                  <br></br>Singapore 199018
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <FooterPageLink />
      </div>
    </form>
  );
};

export default ContactusPage;
