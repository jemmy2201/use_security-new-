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
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';

interface ResubmitPhotoPageProps {
  bookingId: string;
}

interface FaceRectangle {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface FaceAttributes {
  glasses: string;
}

interface FaceData {
  faceRectangle: FaceRectangle;
  faceAttributes: FaceAttributes;
}

const API_ENDPOINT = 'https://validate-photo.cognitiveservices.azure.com/';
const API_KEY = '';

const ResubmitPhoto: React.FC<ResubmitPhotoPageProps> = ({ bookingId }) => {

  const [image, setImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }> | null>(null);
  const [straightFaceDetected, setStraightFaceDetected] = useState<boolean>(false);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [shouldersVisible, setShouldersVisible] = useState<boolean>(false);
  const [faceCentered, setFaceCentered] = useState<boolean>(false);

  const [bgColorMatch, setBgColorMatch] = useState<boolean>(false);
  const [showBookingAppointment, setShowBookingAppointment] = useState<boolean>(false);
  const [brightnessContrast, setBrightnessContrast] = useState<{ brightness: number; contrast: number } | null>(null);
  const [spectacleDetected, setSpectacleDetected] = useState<boolean>(false);
  const [isFileSizeValid, setIsFileSizeValid] = useState<boolean>(true);
  const [isFileFormatValid, setIsFileFormatValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [bookingSchedule, setBookingSchedule] = useState<booking_schedules>();



  useEffect(() => {
    setLoading(true);
    if (showBookingAppointment) {
    }
    setLoading(false);

  }, [showBookingAppointment]);

  useEffect(() => {
    setLoading(true);
    const fetchBookingSchedule = async () => {
      try {
        setLoading(true);

        const responseBookingSchedule = await fetch(`/api/get-booking-schedule?bookingId=${encodeURIComponent(bookingId)}`);
        if (!responseBookingSchedule.ok && responseBookingSchedule.status === 401) {
          setLoading(false);
          router.push('/signin');
          throw new Error('Log out');
        }
        if (!responseBookingSchedule.ok) {
          throw new Error('Network response was not ok');
        }
        const dataBookingSchedule: booking_schedules = await responseBookingSchedule.json();
        const appointment_date = dataBookingSchedule?.appointment_date;
        if (appointment_date) {
          const currentDate = new Date();
          const appointmentDate = new Date(appointment_date);
          const diffInTime = appointmentDate.getTime() - currentDate.getTime();
          const diffInDays = diffInTime / (1000 * 3600 * 24);

          if (appointmentDate > currentDate && diffInDays > 2) {
            setShowBookingAppointment(false);
          } else {
            setShowBookingAppointment(true);
          }
        } else {
          setShowBookingAppointment(true);
        }
        setBookingSchedule(dataBookingSchedule);
      } catch (error) {
        console.error('Error fetching disabled dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingSchedule();

    const loadModels = async () => {
      try {
        setLoading(true);

        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();

    setLoading(false);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 769);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [bookingId, router, showBookingAppointment]);


  const onComplete = async () => {
    setLoading(true);

    if (bgColorMatch && faceDetected && isFileSizeValid && isFileFormatValid) {
      try {
        const response = await axios.post('/api/handle-resubmit-image', {
          image,
          bookingId,
        });

        router.push('/homepage');

      } catch (error) {
        console.error('Error sending data to API:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Plese upload correct photo.');
    }
    setLoading(false);
  };

  const onNext = async () => {
    setLoading(true);

    if (bgColorMatch && faceDetected && straightFaceDetected
      && straightFaceDetected && shouldersVisible && isFileSizeValid && isFileFormatValid) {
      try {
        const response = await axios.post('/api/handle-resubmit-image', {
          image,
          bookingId,
        });

        router.push(`/reschedule?bookingId=${encodeURIComponent(bookingId)}`);

      } catch (error) {
        console.error('Error sending data to API:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Plese upload correct photo.');
    }
    setLoading(false);
  };

  const onBack = async () => {

    try {
      router.push('/homepage');
    } catch (err) {
      setErrorMessage('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  async function detectEyeWear(imageBlob: ArrayBuffer): Promise<FaceData[] | null> {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/face/v1.0/detect`,
        imageBlob,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': API_KEY,
            'Content-Type': 'application/octet-stream',
          },
          params: {
            returnFaceId: false,
            returnFaceLandmarks: false,
            returnFaceAttributes: 'headPose,glasses',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error detecting face:', error);
      return null;
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSpectacleDetected(false);
    const file = event.target.files?.[0];
    if (file) {

      // try {
      //   const imageBlob = await file.arrayBuffer();
      //   const faceData = await detectEyeWear(imageBlob);
      //   if (!faceData || faceData.length === 0) {
      //     console.log('empty facedata');
      //   } else {
      //     const glasses = faceData[0].faceAttributes.glasses;
      //     if (glasses === 'NoGlasses') {
      //       setSpectacleDetected(false);
      //     } else {
      //       setSpectacleDetected(true);
      //     }
      //   }
      // } catch (error) {
      //   console.log('error in detecting eyewear');
      // }


      const fileSizeInBytes = file.size;

      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes
      const minSizeInBytes = 20 * 1024; // 20KB in bytes

      let fileSizeValid = true;
      if (fileSizeInBytes < minSizeInBytes || fileSizeInBytes > maxSizeInBytes) {
        fileSizeValid = false;
        // Don't return here - continue processing to show the image
      }
      setIsFileSizeValid(fileSizeValid);

      // Check file format (JPEG or PNG only)
      let fileFormatValid = true;
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedFormats.includes(file.type.toLowerCase())) {
        fileFormatValid = false;
        // Don't return here - continue processing to show the image
      }
      setIsFileFormatValid(fileFormatValid);

      const img = URL.createObjectURL(file);
      setImage(img);

      const imageElement = document.createElement('img');
      imageElement.src = img;
      imageElement.onload = async () => {
        try {
          const detectionSingleFace = await faceapi.detectSingleFace(imageElement).withFaceLandmarks();
          let isStraight = true;
          if (detectionSingleFace) {
            setDetectionResult(detectionSingleFace);

            const landmarks = detectionSingleFace.landmarks;
            const faceRectangle = detectionSingleFace.detection.box;
            const { x: eyeLeftX, y: eyeLeftY } = landmarks.getLeftEye()[0];
            const { x: eyeRightX, y: eyeRightY } = landmarks.getRightEye()[0];
            const eyeLineSlope = (eyeRightY - eyeLeftY) / (eyeRightX - eyeLeftX);
            const angle = Math.atan(eyeLineSlope) * (180 / Math.PI);
            isStraight = Math.abs(angle) < 10;
            //console.log('Is the face straight?', isStraight);
            setStraightFaceDetected(isStraight);

            // Check if shoulders are visible
            const areShouldersVisible = checkIfShouldersVisible(landmarks, imageElement.naturalHeight || imageElement.height);
            setShouldersVisible(areShouldersVisible);

            // Check if the face is centered
            const isCentered = isFaceCentered(faceRectangle, imageElement.width, imageElement.height);
            setFaceCentered(isCentered);
          }

          // Detect face
          const isFaceDetected = await detectFace(imageElement);
          setFaceDetected(isFaceDetected);

          // Check background color
          const isBgColorMatch = verifyBackgroundColor(imageElement, '#ffffff');
          setBgColorMatch(isBgColorMatch);

          // Check brightness and contrast
          const bc = checkBrightnessContrast(imageElement);
          setBrightnessContrast(bc);

          // Resize image
          const resizedImage = resizeImage(imageElement, 400, 514);
          setImage(resizedImage);

        } catch (error) {
          console.error('Error processing image:', error);
        } finally {
          setLoading(false);
        }
      };
    }
  };

  // Helper function to check if shoulders are visible
  const checkIfShouldersVisible = (landmarks: faceapi.FaceLandmarks68, imageHeight: number): boolean => {
    const jawPositions = landmarks.getJawOutline();
    const jawBottomY = jawPositions[jawPositions.length - 1].y;

    // Assuming that if the jaw is located within the top 80% of the image, the shoulders are visible
    const jawThreshold = 0.8 * imageHeight;
    return jawBottomY < jawThreshold;
  };

  function isFaceCentered(faceRectangle: faceapi.FaceDetection['box'], imageWidth: number, imageHeight: number): boolean {
    const { x: left, y: top, width, height } = faceRectangle;
    const faceCenterX = left + width / 2;
    const faceCenterY = top + height / 2;

    const imageCenterX = imageWidth / 2;
    const imageCenterY = imageHeight / 2;

    const horizontalOffset = Math.abs(faceCenterX - imageCenterX) / imageWidth;
    const verticalOffset = Math.abs(faceCenterY - imageHeight) / imageHeight;

    return horizontalOffset < 0.1 && verticalOffset < 0.1;
  }

  const detectFace = async (imageElement: HTMLImageElement) => {
    try {
      const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks();
      
      if (detections.length === 0) {
        return false; // No face detected
      }

      // Check if the face has adequate brightness/visibility
      const detection = detections[0]; // Use the first detected face
      const faceBox = detection.detection.box;
      
      // Extract face region for brightness analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context for face brightness check');
        return detections.length > 0; // Fallback to basic face detection
      }

      // Set canvas size to face region
      canvas.width = faceBox.width;
      canvas.height = faceBox.height;
      
      // Draw only the face region
      ctx.drawImage(
        imageElement,
        faceBox.x, faceBox.y, faceBox.width, faceBox.height, // source
        0, 0, faceBox.width, faceBox.height // destination
      );

      // Get image data for the face region
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate average brightness of the face region
      let totalBrightness = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a > 0) { // Only count non-transparent pixels
          // Calculate luminance using standard formula
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          totalBrightness += brightness;
          pixelCount++;
        }
      }

      if (pixelCount === 0) {
        return false; // No valid pixels in face region
      }

      const averageBrightness = totalBrightness / pixelCount;
      
      // Face is considered too dark if average brightness is below threshold
      // Brightness scale: 0-255, threshold set to 70 (adjust as needed)
      const MIN_FACE_BRIGHTNESS = 70;
      const isFaceBrightEnough = averageBrightness >= MIN_FACE_BRIGHTNESS;
      
      return isFaceBrightEnough;
      
    } catch (error) {
      console.error('Error detecting face:', error);
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

      if (a > 0) {
        totalPixelCount++;
        if (Math.abs(r - targetRGB.r) < 30 && Math.abs(g - targetRGB.g) < 30 && Math.abs(b - targetRGB.b) < 30) {
          whitePixelCount++;
        }
      }
    }

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
      // Use natural dimensions for calculations
      const imageWidth = image.naturalWidth || image.width;
      const imageHeight = image.naturalHeight || image.height;
      
      // Calculate crop dimensions to maintain aspect ratio
      const targetAspect = width / height; // 400/514 ≈ 0.778
      const imageAspect = imageWidth / imageHeight;
      
      let sourceX = 0, sourceY = 0, sourceWidth = imageWidth, sourceHeight = imageHeight;
      
      if (imageAspect > targetAspect) {
        // Image is wider than target - crop width (center horizontally)
        sourceWidth = imageHeight * targetAspect;
        sourceX = (imageWidth - sourceWidth) / 2;
      } else if (imageAspect < targetAspect) {
        // Image is taller than target - crop height (center vertically)
        sourceHeight = imageWidth / targetAspect;
        sourceY = (imageHeight - sourceHeight) / 2;
      }
      
      // Draw the cropped portion of the image
      ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
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

    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 769);


  return (

    <form>
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </div>
      )}
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
            This photo will be used for your ID Card.
          </div>
          <div className={resubmitPhotoContentstyles.warningBox}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_1358_8175)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M22.1719 18.295C22.7419 19.235 22.3119 20.005 21.2119 20.005H3.21191C2.11191 20.005 1.68191 19.235 2.25191 18.295L11.1619 3.705C11.7419 2.765 12.6819 2.765 13.2519 3.705L22.1719 18.295ZM12.2119 14.005C11.6619 14.005 11.2119 13.555 11.2119 13.005V9.005C11.2119 8.455 11.6619 8.005 12.2119 8.005C12.7619 8.005 13.2119 8.455 13.2119 9.005V13.005C13.2119 13.555 12.7619 14.005 12.2119 14.005ZM12.2119 18.005C12.7642 18.005 13.2119 17.5573 13.2119 17.005C13.2119 16.4527 12.7642 16.005 12.2119 16.005C11.6596 16.005 11.2119 16.4527 11.2119 17.005C11.2119 17.5573 11.6596 18.005 12.2119 18.005Z" fill="#FF8F00" />
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

          {image && (!faceDetected || !bgColorMatch || !straightFaceDetected || !shouldersVisible || spectacleDetected || !isFileSizeValid || !isFileFormatValid) ? (
            <div className={resubmitPhotoContentstyles.photoUploadError}>
              <div className={resubmitPhotoContentstyles.photoUploadErrorBox}>
                <div>
                  <h1>Your photo has been rejected for the following reasons:</h1>
                </div>

                {shouldersVisible ? (
                  <p></p>
                ) : (
                  <div className={globalStyleCss.regular}> .  Your shoulders are not fully visible in the image. </div>
                )}

                {straightFaceDetected ? (
                  <p></p>
                ) : (
                  <div className={globalStyleCss.regular}> .  It looks like your image might not be straight. Try adjusting the angle of your photo to make sure your face is aligned correctly. </div>
                )}

                {faceDetected ? (
                  <p></p>
                ) : (
                  <div className={globalStyleCss.regular}> .  The face is not clearly visible or is too dark. Please ensure your face is well-lit and clearly visible in the photo.</div>
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
                {isFileSizeValid ? (
                  <p></p>
                ) : (
                  <div className={globalStyleCss.regular}> .  Image size should be less than 2MB and greater than 20KB</div>
                )}
                {isFileFormatValid ? (
                  <p></p>
                ) : (
                  <div className={globalStyleCss.regular}> .  Photo uploaded must be in JPEG or PNG format</div>
                )}
              </div>
            </div>
          ) : (
            <p></p>
          )}

          <div className={resubmitPhotoContentstyles.photoContainer}>

            <div className={resubmitPhotoContentstyles.uploadBox}>

              <div className={resubmitPhotoContentstyles.uploadPhotoContainerBox}>
                {<Image 
                  src={image ? image : ''} 
                  alt='ID Photo' 
                  height={360} 
                  width={280}
                  style={{ objectFit: 'cover' }}
                />}
              </div>

              <div className={globalStyleCss.regular}>
                Maximum file size: 2 MB <br></br>
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
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

            </div>

            <div className={resubmitPhotoContentstyles.photosDosDontContainer}>
              <div className={resubmitPhotoContentstyles.dosDontDoText}>
                Dos and Don’ts
              </div>
              <div className={resubmitPhotoContentstyles.photosDosDontContainerPicsBox}>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <Image src='/images/clear_pic2.png' alt='' height={80} width={120}></Image>
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
                    <Image src='/images/clear_pic3.png' alt='' height={80} width={120}></Image>
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
                    <Image src='/images/clear_pic3.png' alt='' height={80} width={120}></Image>
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
                    <Image src='/images/2.png' alt='' height={80} width={120}></Image>

                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <Image src='/images/5.png' alt='' height={80} width={120}></Image>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
                <div className={resubmitPhotoContentstyles.picBox}>
                  <div className={resubmitPhotoContentstyles.picFrame}>
                    <Image src='/images/6.png' alt='' height={80} width={120}></Image>
                  </div>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Photo Guidelines Text */}
              <div className={resubmitPhotoContentstyles.dosDontDoText}>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: '0', color: '#000', fontFamily: 'Roboto', fontSize: '14px', lineHeight: '20px' }}>
                  <li>Photo must be taken within 3 months</li>
                  <li>Photo must be taken with even brightness</li>
                  <li>Photo must be clear and in sharp focus</li>
                  <li>Photo must be taken without eye wear/ spectacles</li>
                  <li>Photo background must be plain white in colour</li>
                  <li>Head gear used for religious reasons must be in dark colour against white background</li>
                  <li>Must be appropriately attired minimally with polo tee-shirt</li>
                  <li>Shoulders, hair and ears must be fully visible</li>
                </ul>
              </div>
              
              <div className={resubmitPhotoContentstyles.dosDontDoText}>
                <div className={globalStyleCss.blueLink}><a href="/content/photo_guideline.pdf" target="_blank" rel="noopener noreferrer">View photo guidelines</a></div>
              </div>
            </div>

          </div>
        </div>
        <div className={resubmitPhotoContentstyles.buttonContainer}>
          <button className={resubmitPhotoContentstyles.cancel} type='button' onClick={onBack} style={{ marginRight: '10px' }}>
            <div className={globalStyleCss.regular}>Cancel</div>
          </button>


          {showBookingAppointment ? (
            <button className={resubmitPhotoContentstyles.continue} type='button' onClick={onNext}>
              <div className={globalStyleCss.buttonText}>Book appointment</div>
            </button>

          ) : (

            <button className={resubmitPhotoContentstyles.continue} type='button' onClick={onComplete}>
              <div className={globalStyleCss.buttonText}>Complete</div>
            </button>
          )}

        </div>
      </div>
      <div >
        <FooterPageLink />
      </div>
    </form>
  );
};

export default ResubmitPhoto;
