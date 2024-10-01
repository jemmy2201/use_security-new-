"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import contactusContentstyles from './ContactusContent.module.scss';
import globalStyleCss from '../components/globalstyle/Global.module.css';
import headerstyles from './HeaderStyle.module.css';
import FooterPageLink from '../components/footer/FooterPage'
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const ContactusPage: React.FC = () => {

    const handleLoginClick = async () => {
        signIn('singpass');
    };

    return (

        <div style={{ display: 'flex', flexWrap: 'nowrap', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>


            <div className={headerstyles.headerContainer}>
                <div className={headerstyles.logo}><Link href="/signin"><img src="/images/logo.png" alt="Logo" /></Link></div>
                <div className={headerstyles.companyName}>Union of Security Employees (USE)</div>
                <div className={headerstyles.leftBox}>
                    <div className={headerstyles.phoneSvg}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <path d="M20.7031 21C18.6197 21 16.5614 20.5458 14.5281 19.6375C12.4947 18.7292 10.6447 17.4417 8.97808 15.775C7.31142 14.1083 6.02392 12.2583 5.11558 10.225C4.20725 8.19167 3.75308 6.13333 3.75308 4.05C3.75308 3.75 3.85308 3.5 4.05308 3.3C4.25308 3.1 4.50308 3 4.80308 3H8.85308C9.08642 3 9.29475 3.07917 9.47808 3.2375C9.66142 3.39583 9.76975 3.58333 9.80308 3.8L10.4531 7.3C10.4864 7.56667 10.4781 7.79167 10.4281 7.975C10.3781 8.15833 10.2864 8.31667 10.1531 8.45L7.72808 10.9C8.06142 11.5167 8.45725 12.1125 8.91558 12.6875C9.37392 13.2625 9.87808 13.8167 10.4281 14.35C10.9447 14.8667 11.4864 15.3458 12.0531 15.7875C12.6197 16.2292 13.2197 16.6333 13.8531 17L16.2031 14.65C16.3531 14.5 16.5489 14.3875 16.7906 14.3125C17.0322 14.2375 17.2697 14.2167 17.5031 14.25L20.9531 14.95C21.1864 15.0167 21.3781 15.1375 21.5281 15.3125C21.6781 15.4875 21.7531 15.6833 21.7531 15.9V19.95C21.7531 20.25 21.6531 20.5 21.4531 20.7C21.2531 20.9 21.0031 21 20.7031 21ZM6.77808 9L8.42808 7.35L8.00308 5H5.77808C5.86142 5.68333 5.97808 6.35833 6.12808 7.025C6.27808 7.69167 6.49475 8.35 6.77808 9ZM15.7281 17.95C16.3781 18.2333 17.0406 18.4583 17.7156 18.625C18.3906 18.7917 19.0697 18.9 19.7531 18.95V16.75L17.4031 16.275L15.7281 17.95Z" fill="white" />
                        </svg>
                    </div>
                    <div className={headerstyles.contactUs}><Link href="/contactus">Contact us</Link></div>
                    <div className={headerstyles.loginButton}>
                        <button type='button' onClick={handleLoginClick} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <div className={globalStyleCss.button}>Log in with</div>
                            <svg style={{ marginLeft: '4px', alignItems: 'center' }} xmlns="http://www.w3.org/2000/svg" width="93" height="16" viewBox="0 0 93 16" fill="none">
                                <g clipPath="url(#clip0_1418_3512)">
                                    <path d="M5.88072 11.8095C3.33913 11.8095 1.54059 10.9529 0.753052 10.2322L2.43985 7.75379C3.49642 8.65494 4.80137 9.10604 5.88072 9.10604C6.80275 9.10604 7.20737 8.83539 7.20737 8.3397C7.20737 7.95707 6.89278 7.66355 5.90349 7.43855L3.90211 6.9657C1.9452 6.51349 1.02316 5.31884 1.02316 3.67416C1.02316 1.42075 2.82169 0.0913086 5.49778 0.0913086C7.56642 0.0913086 9.23044 0.721787 10.0408 1.44357L8.35396 3.922C7.61199 3.24588 6.53265 2.75019 5.49778 2.75019C4.64301 2.75019 4.26116 3.04368 4.26116 3.49372C4.26116 3.94375 4.66578 4.19268 5.43054 4.37204L7.43192 4.82316C9.47777 5.27426 10.4682 6.37761 10.4682 8.00054C10.4682 10.3214 8.73581 11.8095 5.88072 11.8095ZM17.889 11.5834H21.2627V5.52212C21.2627 4.03505 21.9819 3.11108 23.3769 3.11108C24.7035 3.11108 25.401 3.87744 25.401 5.52212V11.5845H28.7746V4.66553C28.7746 1.64576 27.2678 0.0913086 24.6817 0.0913086C23.1979 0.0913086 22.073 0.677218 21.2637 1.82621V1.10551C21.2637 0.609823 20.9719 0.316324 20.4762 0.316324H17.8901V11.5834H17.889ZM42.4469 0.316324V10.0735C42.4469 14.3097 39.7036 16 36.3299 16C34.0812 16 32.2144 15.4141 31.0906 14.3999L32.8445 11.7856C33.5866 12.5063 34.7787 13.1607 36.3299 13.1607C38.0613 13.1607 39.0732 12.0562 39.0732 10.5246V9.80392C38.264 10.8181 37.0948 11.2682 35.6552 11.2682C32.9346 11.2682 30.5731 8.87995 30.5731 5.67973C30.5731 2.47952 32.9346 0.0913086 35.6552 0.0913086C37.0948 0.0913086 38.3086 0.632649 39.0732 1.78164V1.10551C39.0732 0.609823 39.3662 0.316324 39.8608 0.316324H42.4469ZM39.186 5.67973C39.186 4.2155 38.084 3.06543 36.5555 3.06543C35.1388 3.06543 33.9924 4.21441 33.9924 5.67973C33.9924 7.14397 35.1388 8.29403 36.5555 8.29403C38.084 8.29403 39.186 7.14397 39.186 5.67973ZM57.1985 5.95041C57.1985 9.42128 54.837 11.8095 51.9135 11.8095C50.3841 11.8095 49.1702 11.3584 48.2926 10.3453V15.7315H44.919V0.316324H47.5062C48.0009 0.316324 48.2938 0.609823 48.2938 1.10551V1.78164C49.1258 0.632649 50.3853 0.0913086 51.9147 0.0913086C54.8382 0.0913086 57.1985 2.47952 57.1985 5.95041ZM53.7804 5.95041C53.7804 4.26008 52.5883 3.06543 51.0144 3.06543C49.4175 3.06543 48.181 4.26008 48.181 5.95041C48.181 7.64074 49.4175 8.83539 51.0144 8.83539C52.5893 8.8343 53.7804 7.63965 53.7804 5.95041ZM70.9164 0.316324V11.5834H67.5428V10.1192C66.7108 11.2682 65.4513 11.8095 63.9218 11.8095C60.9984 11.8095 58.6369 9.42128 58.6369 5.95041C58.6369 2.47952 60.9984 0.0913086 63.9218 0.0913086C65.4513 0.0913086 66.7108 0.632649 67.5428 1.78164V1.10551C67.5428 0.609823 67.8357 0.316324 68.3303 0.316324H70.9164ZM67.6556 5.95041C67.6556 4.26008 66.419 3.06543 64.8222 3.06543C63.2483 3.06543 62.0562 4.26008 62.0562 5.95041C62.0562 7.64074 63.2483 8.83539 64.8222 8.83539C66.419 8.8343 67.6556 7.63965 67.6556 5.95041ZM77.7537 11.8095C80.6098 11.8095 82.3412 10.3224 82.3412 8.00163C82.3412 6.3787 81.3518 5.27535 79.3049 4.82425L77.3036 4.37313C76.5387 4.19268 76.1342 3.94484 76.1342 3.4948C76.1342 3.04477 76.516 2.75128 77.3707 2.75128C78.4056 2.75128 79.4849 3.24696 80.2268 3.92309L81.9137 1.44466C81.1045 0.72396 79.4405 0.0923956 77.3707 0.0923956C74.6946 0.0923956 72.8961 1.42183 72.8961 3.67525C72.8961 5.31993 73.8181 6.51458 75.7751 6.9657L77.7765 7.43855C78.7657 7.66355 79.0804 7.95707 79.0804 8.3397C79.0804 8.83539 78.6756 9.10604 77.7537 9.10604C76.6742 9.10604 75.3705 8.65494 74.3128 7.75379L72.626 10.2322C73.4136 10.9529 75.2121 11.8095 77.7537 11.8095ZM88.4125 11.8095C91.2686 11.8095 93 10.3224 93 8.00163C93 6.3787 92.0107 5.27535 89.9637 4.82425L87.9623 4.37313C87.1975 4.19268 86.7929 3.94484 86.7929 3.4948C86.7929 3.04477 87.1748 2.75128 88.0295 2.75128C89.0644 2.75128 90.1439 3.24696 90.8858 3.92309L92.5725 1.44466C91.7634 0.72396 90.0992 0.0923956 88.0295 0.0923956C85.3535 0.0923956 83.555 1.42183 83.555 3.67525C83.555 5.31993 84.4769 6.51458 86.4338 6.9657L88.4352 7.43855C89.4247 7.66355 89.7391 7.95707 89.7391 8.3397C89.7391 8.83539 89.3346 9.10604 88.4125 9.10604C87.3332 9.10604 86.0293 8.65494 84.9717 7.75379L83.2848 10.2322C84.0723 10.9529 85.8721 11.8095 88.4125 11.8095Z" fill="white" />
                                    <path d="M13.7962 3.92201C14.8983 3.92201 15.7531 3.06542 15.7531 1.961C15.7531 0.856581 14.8983 0 13.7962 0C12.6941 0 11.8393 0.856581 11.8393 1.961C11.8404 3.06542 12.6941 3.92201 13.7962 3.92201ZM11.682 11.5834H15.9093L15.01 4.57531C14.3353 4.77859 13.256 4.77859 12.5813 4.57531L11.682 11.5834Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1418_3512">
                                        <rect width="92.2469" height="16" fill="white" transform="translate(0.753052)" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </button>
                    </div>
                </div>
            </div>
            <div className={contactusContentstyles.mainContainer}>
                <div className={contactusContentstyles.contactusContainer}>
                    <div className={globalStyleCss.header2}>
                        Contact us
                    </div>

                    <div className={contactusContentstyles.bodyContainer}>
                        <div className={globalStyleCss.header2}>
                            Union of Security Employees (USE)
                        </div>

                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Customer Service Centre</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>+65 6381 9150<br></br>+65 6291 5145</div>
                            </div>
                        </div>
                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Email</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>use-idcard@ntuc.org.sg</div>
                            </div>
                        </div>
                        <hr className={contactusContentstyles.hrLine}></hr>
                        <div className={contactusContentstyles.box1}>
                            <div className={contactusContentstyles.leftText}>
                                <div className={globalStyleCss.regularBold}>Location</div>
                            </div>
                            <div className={contactusContentstyles.rightText}>
                                <div className={globalStyleCss.regular}>Union of Security Employees (USE)
                                    <br></br>200 Jalan Sultan
                                    <br></br>#03-24 Textile Centre
                                    <br></br>Singapore 199018
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div >
                <FooterPageLink />
            </div>
        </div>

    );
};

export default ContactusPage;
