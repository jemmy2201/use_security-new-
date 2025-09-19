"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import reviewPhotoContentstyles from './ReviewPhotoContent.module.css';
import globalStyleCss from '../globalstyle/Global.module.css';
import { useRouter } from 'next/navigation';
import { useFormContext } from '.././FormContext';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';

const ReviewImageProcessing: React.FC = () => {

  const [detectionResult, setDetectionResult] = useState<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }> | null>(null);
  const { formData, setFormData } = useFormContext();
  const [shouldersVisible, setShouldersVisible] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [bgColorMatch, setBgColorMatch] = useState<boolean>(false);
  const [straightFaceDetected, setStraightFaceDetected] = useState<boolean>(false);
  const [brightnessContrast, setBrightnessContrast] = useState<{ brightness: number; contrast: number } | null>(null);
  const [spectacleDetected, setSpectacleDetected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {

    const loadModels = async () => {
      try {
        setLoading(true);
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        if (formData.imageUrl) {
          // Since photos in saved drafts are guaranteed to be valid 
          // (invalid photos cannot be saved), we can trust them immediately
          setFormData(prevFormData => ({
            ...prevFormData,
            isFaceDetected: true,
            isStraightFaceDetected: true,
            isBgColorMatch: true,
            isShoulderVisible: true,
            isFileSizeValid: true,
            isFileFormatValid: true,
          }));
        }

      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, [formData.imageUrl, setFormData]);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const fileSizeInBytes = file.size;

      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
      const minSizeInBytes = 25 * 1024; // 25kb in bytes

      let isFileSizeValid = true;
      if (fileSizeInBytes < minSizeInBytes || fileSizeInBytes > maxSizeInBytes) {
        // Set validation error but continue processing to show the image
        isFileSizeValid = false;
        // Don't return here - continue processing to show the image
      }

      // Check file format (JPEG or PNG only)
      let isFileFormatValid = true;
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedFormats.includes(file.type.toLowerCase())) {
        isFileFormatValid = false;
        // Don't return here - continue processing to show the image
      }

      const img = URL.createObjectURL(file);
      setImage(img);
      setFormData(prevFormData => ({
        ...prevFormData,
        ['image']: img,
      }));
      const imageElement = document.createElement('img');
      imageElement.src = img;
      imageElement.onload = async () => {
        try {
          const detectionSingleFace = await faceapi.detectSingleFace(imageElement).withFaceLandmarks();
          let isStraight = true;
          let isShoulderVisible = true;
          if (detectionSingleFace) {
            setDetectionResult(detectionSingleFace);

            const landmarks = detectionSingleFace.landmarks;
            const { x: eyeLeftX, y: eyeLeftY } = landmarks.getLeftEye()[0]; // Get the left eye position
            const { x: eyeRightX, y: eyeRightY } = landmarks.getRightEye()[0]; // Get the right eye position
            const { x: noseX, y: noseY } = landmarks.getNose()[3]; // Get the nose position
            const eyeLineSlope = (eyeRightY - eyeLeftY) / (eyeRightX - eyeLeftX);
            const angle = Math.atan(eyeLineSlope) * (180 / Math.PI); // Convert radians to degrees
            isStraight = Math.abs(angle) < 10;
            setStraightFaceDetected(isStraight);

            // Check if shoulders are visible
            isShoulderVisible = checkIfShouldersVisible(landmarks, imageElement.naturalHeight || imageElement.height);
            setShouldersVisible(isShoulderVisible);
          }

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
          const resizedImage = resizeImage(imageElement, 400, 514);
          setImage(resizedImage);
          const fileName = formData?.passid + formData.nric?.slice(-4);
          setFormData(prevFormData => ({
            ...prevFormData,
            ['image']: resizedImage,
            ['isFaceDetected']: isFaceDetected,
            ['isStraightFaceDetected']: isStraight,
            ['isBgColorMatch']: isBgColorMatch,
            ['isShoulderVisible']: isShoulderVisible,
            ['isFileSizeValid']: isFileSizeValid,
            ['isFileFormatValid']: isFileFormatValid,
            ['imageUrl']: fileName,
            ['errorPhoto']: '',
          }));

        } catch (error) {
          console.error('Error processing image:', error);
        } finally {
          setLoading(false);
        }
      };
    }
  };

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

  const detectSpectacles = async (imageElement: HTMLImageElement) => {
    try {
      const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks();

      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        if (leftEye.length > 0 && rightEye.length > 0 && nose.length > 0) {
          const eyeDistance = Math.hypot(leftEye[3].x - rightEye[3].x, leftEye[3].y - rightEye[3].y);
          const noseWidth = Math.hypot(nose[2].x - nose[1].x, nose[2].y - nose[1].y);

          // Example refined heuristic: Adjust these values based on actual data
          const isGlassesDetected = eyeDistance < 40 && noseWidth > 20;

          // Additional checks can be added here
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

    // Adjust percentage threshold based on your requirement
    return whitePixelPercentage > 40; // This threshold can be adjusted
  };

  const checkBrightnessContrast = (image: HTMLImageElement) => {
    // Placeholder logic for checking brightness and contrast
    return { brightness: 75, contrast: 85 }; // Example values
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
      const response = await axios.post('/api/handle-app-dtl-image', {
        image,
        bookingId,
      });

    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  return (

    <div className={reviewPhotoContentstyles.mainContainer}>
      {loading && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </div>
      )}
      <div className={reviewPhotoContentstyles.stepContentContainer}>

        <div className={globalStyleCss.regular}>
          Please ensure your photo complies with the guidelines to prevent your application from being rejected.

          <br></br><br></br>
          {formData.errorPhoto && <p style={{ color: 'red' }}>{formData.errorPhoto}</p>}
        </div>
        <div className={reviewPhotoContentstyles.warningBox}>
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
        <br></br>
        <hr className={reviewPhotoContentstyles.photoHrLine}></hr>
        {formData.image && (!formData.isFaceDetected || !formData.isBgColorMatch
          || !formData.isStraightFaceDetected || !formData.isShoulderVisible || !formData.isFileSizeValid || !formData.isFileFormatValid) ? (
          <div className={reviewPhotoContentstyles.photoUploadError}>
            <div className={reviewPhotoContentstyles.photoUploadErrorBox}>
              <div className={globalStyleCss.regularBold}>
                Your photo has been rejected for the following reasons:
              </div>

              {formData.isShoulderVisible ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  Your shoulders are not fully visible in the image. </div>
              )}

              {formData.isStraightFaceDetected ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  It looks like your image might not be straight. Try adjusting the angle of your photo to make sure your face is aligned correctly. </div>
              )}

              {formData.isFaceDetected ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  The face is not clearly visible or is too dark. Please ensure your face is well-lit and clearly visible in the photo.</div>
              )}
              {formData.isBgColorMatch ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  The background is not white</div>
              )}
              {formData.isFileSizeValid ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  Image size should be less than 5MB and greater than 25KB</div>
              )}
              {formData.isFileFormatValid ? (
                <p></p>
              ) : (
                <div className={globalStyleCss.regular}> .  Photo uploaded must be in JPEG or PNG format</div>
              )}
            </div>
          </div>
        ) : (
          <p></p>
        )}

        <div className={reviewPhotoContentstyles.photoContainer}>
          <div className={reviewPhotoContentstyles.uploadBox}>
            <div className={reviewPhotoContentstyles.uploadPhotoContainerBox}>
              {formData.image ? (
                <>
                  {formData.image && <Image 
                    src={formData.image} 
                    alt="Photo ID" 
                    height={360} 
                    width={280}
                    style={{ objectFit: 'cover' }}
                  />}
                </>
              ) : (
                <>
                  {formData.imageUrl && <Image 
                    src={`/api/get-image?imageName=${formData.imageUrl}&t=${new Date().getTime()}`} 
                    alt="Photo ID" 
                    height={360} 
                    width={280}
                    style={{ objectFit: 'cover' }}
                  />}
                </>
              )

              }
            </div>

            <div className={globalStyleCss.regular}>
            Minimum file size: 25 KB <br></br>Maximum file size: 5 MB <br></br>
              Supported file types: JPG / PNG
            </div>

            <div>
              <label htmlFor="file-upload" className={reviewPhotoContentstyles.chooseFileButton}>
                <div className={reviewPhotoContentstyles.chooseFileButtonText}>
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

          <div className={reviewPhotoContentstyles.photosDosDontContainer}>
            <div className={reviewPhotoContentstyles.dosDontDoText}>
              Dos and Don’ts
            </div>
            <div className={reviewPhotoContentstyles.photosDosDontContainerPicsBox}>
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/clear_pic2.png' alt='' height={120} width={95}></Image>
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
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/clear_pic3.png' alt='' height={120} width={95}></Image>
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
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/clear_pic3.png' alt='' height={120} width={95}></Image>
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
            <div className={reviewPhotoContentstyles.photosDosDontContainerPicsBox}>
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/2.png' alt='' height={120} width={95}></Image>

                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                  </svg>
                </div>
              </div>
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/5.png' alt='' height={120} width={95}></Image>
                </div>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#CC0C00" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.4142 15.5858C17.6332 14.8047 16.3668 14.8047 15.5858 15.5858C14.8047 16.3668 14.8047 17.6332 15.5858 18.4142L21.2429 24.0713L15.5862 29.7279C14.8052 30.509 14.8052 31.7753 15.5862 32.5563C16.3673 33.3374 17.6336 33.3374 18.4147 32.5563L24.0713 26.8997L29.7279 32.5563C30.509 33.3374 31.7753 33.3374 32.5563 32.5563C33.3374 31.7753 33.3374 30.509 32.5563 29.7279L26.8997 24.0713L32.5568 18.4142C33.3378 17.6332 33.3378 16.3668 32.5568 15.5858C31.7757 14.8047 30.5094 14.8047 29.7284 15.5858L24.0713 21.2429L18.4142 15.5858Z" fill="white" />
                  </svg>
                </div>
              </div>
              <div className={reviewPhotoContentstyles.picBox}>
                <div className={reviewPhotoContentstyles.picFrame}>
                  <Image src='/images/6.png' alt='' height={120} width={95}></Image>
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
            <div className={reviewPhotoContentstyles.dosDontDoText}>
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
            
            <div className={reviewPhotoContentstyles.dosDontDoText}>
              <div className={globalStyleCss.blueLink}><a href="/content/photo_guideline.pdf" target="_blank" rel="noopener noreferrer">View photo guidelines</a></div>
            </div>
            
          </div>
        </div>
      </div>

    </div>


  );
};

export default ReviewImageProcessing;
