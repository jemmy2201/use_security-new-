"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import resubmitPhotoContentstyles from './ResubmitPhotoContent.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import FooterPageLink from '../footer/FooterPage';
import HeaderPageLink from '../header/HeaderPage';
import { useRouter } from 'next/navigation';
import { booking_schedules } from '@prisma/client';

interface ResubmitPhotoPageProps {
  bookingId: string;
}

const ResubmitPhoto: React.FC<ResubmitPhotoPageProps> = ({ bookingId }) => {

  console.log('bookingId', bookingId);
  const [image, setImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [bgColorMatch, setBgColorMatch] = useState<boolean>(false);
  const [brightnessContrast, setBrightnessContrast] = useState<{ brightness: number; contrast: number } | null>(null);
  const [spectacleDetected, setSpectacleDetected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();

  useEffect(() => {

    const fetchBookingSchedule = async () => {
      try {
        const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
        if (!responseBookingSchedule.ok) {
          throw new Error('Network response was not ok');
        }
        const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
        setBookingSchedule(dataBookingSchedule);
      } catch (error) {
        console.error('Error fetching disabled dates:', error);
      }
    };
    fetchBookingSchedule();

    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };
    
    loadModels();
  }, []);

  const onNext = async () => {
    setLoading(true);
    console.log('bookingId', bookingId);
    try {
      router.push(`/reschedule?bookingId=${encodeURIComponent(bookingId)}`);
    } catch (err) {
      setErrorMessage('Failed to open resubmit appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = URL.createObjectURL(file);
      setImage(img);

      const imageElement = new Image();
      imageElement.src = img;
      imageElement.onload = async () => {
        try {
          // Detect face
          const isFaceDetected = await detectFace(imageElement);
          setFaceDetected(isFaceDetected);

          // Detect spectacles
          const isSpectacleDetected = await detectSpectacles(imageElement);
          setSpectacleDetected(isSpectacleDetected);

          // Check background color
          const isBgColorMatch = verifyBackgroundColor(imageElement, '#ffffff');
          setBgColorMatch(isBgColorMatch);

          // Check brightness and contrast
          const bc = checkBrightnessContrast(imageElement);
          setBrightnessContrast(bc);

          // Resize image
          const resizedImage = resizeImage(imageElement, 200, 257);
          setImage(resizedImage);

          // Call API with processed image data
          console.log('isFaceDetected', isFaceDetected);
          console.log('isBgColorMatch', isBgColorMatch);
          if (isBgColorMatch && isFaceDetected) {
            await sendImageToAPI(resizedImage, bookingId);
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      };
    }
  };

  const detectFace = async (imageElement: HTMLImageElement) => {
    try {
      const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks();
      console.log('Face detections:', detections);
      return detections.length > 0;
    } catch (error) {
      console.error('Error detecting face:', error);
      return false;
    }
  };

  const detectSpectacles = async (imageElement: HTMLImageElement) => {
    try {
      const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks();
      console.log('Glass detections:', detections);

      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        if (leftEye.length > 0 && rightEye.length > 0 && nose.length > 0) {
          const eyeDistance = Math.hypot(leftEye[3].x - rightEye[3].x, leftEye[3].y - rightEye[3].y);
          const noseWidth = Math.hypot(nose[2].x - nose[1].x, nose[2].y - nose[1].y);

          const isGlassesDetected = eyeDistance < 40 && noseWidth > 20;

          console.log('Glasses detected:', isGlassesDetected);
          return isGlassesDetected;
        }
      }
      return false;
    } catch (error) {
      console.error('Error detecting spectacles:', error);
      return false;
    }
  };

  const verifyBackgroundColor = (image: HTMLImageElement, targetColor: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return false;
    }

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const targetRGB = { r: 255, g: 255, b: 255 }; // White color

    let whitePixelCount = 0;
    let totalPixelCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 0) { // Consider only non-transparent pixels
        totalPixelCount++;
        // Adjust the color tolerance as needed
        if (Math.abs(r - targetRGB.r) < 30 && Math.abs(g - targetRGB.g) < 30 && Math.abs(b - targetRGB.b) < 30) {
          whitePixelCount++;
        }
      }
    }

    // Calculate the percentage of white pixels
    const whitePixelPercentage = (whitePixelCount / totalPixelCount) * 100;

    return whitePixelPercentage > 40; 
  };

  const checkBrightnessContrast = (image: HTMLImageElement) => {
    return { brightness: 75, contrast: 85 }; 
  };

  const resizeImage = (image: HTMLImageElement, width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg');
    }
    return image.src;
  };

  const sendImageToAPI = async (image: string, bookingId: string) => {
    try {
      const response = await axios.post('/api/handle-resubmit-image', {
        image,
        bookingId,
      });

      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  return (

    <form>
      <div >
        <HeaderPageLink />
      </div>
      <div className={resubmitPhotoContentstyles.mainContainer}>
        <div className={resubmitPhotoContentstyles.headerBox}>
          <div className={globalStyleCss.header1}>
            Re-upload photo
          </div>
        </div>
        <div className={resubmitPhotoContentstyles.stepContentContainer}>
          <div className={globalStyleCss.header1}>
            Photo
          </div>
          <div className={globalStyleCss.header2}>
            This photo will be used for your pass card
          </div>
          <div className={resubmitPhotoContentstyles.warningBox}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_1358_8175)">
                  <path fillRule="evenodd" clip-rule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
                </g>
                <defs>
                  <clipPath id="clip0_1358_8175">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className={globalStyleCss.regular}>
              &nbsp;Please upload a photo that was taken within the last 3 months
            </div>
          </div>

          <hr className={resubmitPhotoContentstyles.photoHrLine}></hr>
          
          {image && (!faceDetected || !bgColorMatch) ? (
        <div className={resubmitPhotoContentstyles.photoUploadError}>
          <div className={resubmitPhotoContentstyles.photoUploadErrorBox}>
            <div>
              <h1>Your photo has been rejected for the following reasons:</h1>
            </div>
            {faceDetected ? (
              <p></p>
            ) : (
              <div> .  The face is not clearly visible</div>
            )}
            {bgColorMatch ? (
              <p></p>
            ) : (
              <div> .  The background is not white</div>
            )}

            {spectacleDetected ? (
              <p>. Eyewear has been detected</p>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      ) : (
        <p></p>
      )}

          <div className={resubmitPhotoContentstyles.photoContainer}>
            <div className={resubmitPhotoContentstyles.uploadBox}>
              <div className={resubmitPhotoContentstyles.uploadPhotoContainerBox}>
                {<img src={image} />}
              </div>

              <div className={globalStyleCss.regular}>
                Maximum file size: 5 MB <br></br>
                Supported file types: JPG / PNG
              </div>

              <div>
                <label htmlFor="file-upload" className={resubmitPhotoContentstyles.chooseFileButton}>
                  <div className={resubmitPhotoContentstyles.chooseFileButtonText}>
                    Choose photo
                  </div>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

            </div>

            <div className={resubmitPhotoContentstyles.photosDosDontContainer}>
              <div className={resubmitPhotoContentstyles.dosDontDoText}>
                Photo dos and don’ts
              </div>
              <div className={resubmitPhotoContentstyles.photosDosDontContainerPicsBox}>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/clear_pic.jpeg'></img>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                      <g clipPath="url(#clip0_923_17105)">
                        <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                      </g>
                      <defs>
                        <clipPath id="clip0_923_17105">
                          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/clear_pic.jpeg'></img>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                      <g clipPath="url(#clip0_923_17105)">
                        <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                      </g>
                      <defs>
                        <clipPath id="clip0_923_17105">
                          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/clear_pic.jpeg'></img>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                      <g clipPath="url(#clip0_923_17105)">
                        <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                      </g>
                      <defs>
                        <clipPath id="clip0_923_17105">
                          <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className={resubmitPhotoContentstyles.photosDosDontContainerPicsBox}>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/specs.jpg'></img>

                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clip-rule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/no_face.png'></img>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clip-rule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <img src='/images/noface.jpeg'></img>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clip-rule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={resubmitPhotoContentstyles.buttonContainer}>
          <button className={resubmitPhotoContentstyles.continue} type='button' onClick={onNext}>
            <div className={globalStyleCss.buttonText}>Continue to book appointment</div>
          </button>
        </div>
      </div>
      <div >
        <FooterPageLink />
      </div>
    </form>
  );
};

export default ResubmitPhoto;
