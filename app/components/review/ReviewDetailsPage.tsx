"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import reviewDetailsContentstyles from './ReviewDetailsContent.module.css';
import { booking_schedules as bookingDetail } from '@prisma/client';
import { users as users } from '@prisma/client';



const ReviewDetailsPage: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [bookingSchedules, setBookingSchedules] = useState<bookingDetail[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    return (

        <div>
            <form>


            <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Personal Details
                        </div>

                    </div>
                </div>



                <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Applicant Details
                        </div>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Please select the pass card type you would like to apply for.
                        </div>
                        <div className={reviewDetailsContentstyles.options}>
                            <div className={reviewDetailsContentstyles.optionsHeader}>
                                <div className={reviewDetailsContentstyles.optionsHeaderText}>
                                    Type of application
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Photo
                        </div>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                        Please make sure your photo meets our photo guidelines to prevent your application from being rejected.                        </div>

                    </div>
                </div>



                <div className={reviewDetailsContentstyles.applicantDetails}>
                    <div className={reviewDetailsContentstyles.applicantDetailsHeaderCard}>
                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContent}>
                            Training records
                        </div>

                        <div className={reviewDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
                            Types of trainings
                        </div>




                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReviewDetailsPage;
