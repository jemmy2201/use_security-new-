import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { useFormContext } from '.././FormContext';
import applicantDetailsContentstyles from './ApplicantDetailsContent.module.css';

const ImageProcessing = () => {

  const { formData, setFormData } = useFormContext();
  const [image, setImage] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [bgColorMatch, setBgColorMatch] = useState<boolean>(false);
  const [brightnessContrast, setBrightnessContrast] = useState<{ brightness: number; contrast: number } | null>(null);
  const [spectacleDetected, setSpectacleDetected] = useState<boolean>(false);

  useEffect(() => {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = URL.createObjectURL(file);
      setImage(img);
      setFormData(prevFormData => ({
        ...prevFormData,
        ['image']: img,
      }));
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
          const resizedImage = resizeImage(imageElement, 200, 200);
          setImage(resizedImage);
          setFormData(prevFormData => ({
            ...prevFormData,
            ['image']: img,
          }));
          // Call API with processed image data
          await sendImageToAPI(resizedImage, isFaceDetected, isBgColorMatch, isSpectacleDetected, bc);
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

          // Example refined heuristic: Adjust these values based on actual data
          const isGlassesDetected = eyeDistance < 40 && noseWidth > 20;

          // Additional checks can be added here
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
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg');
    }
    return image.src;
  };

  const sendImageToAPI = async (image: string, faceDetected: boolean, bgColorMatch: boolean, spectacleDetected: boolean, bc: { brightness: number; contrast: number }) => {
    try {
      // const response = await axios.post('https://your-api-endpoint.com/upload', {
      //   image, // Base64 image string
      //   faceDetected,
      //   bgColorMatch,
      //   spectacleDetected,
      //   brightness: bc.brightness,
      //   contrast: bc.contrast,
      // });

      // console.log('API Response:', response.data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  };

  return (
    <div>
      <div className={applicantDetailsContentstyles.uploadPhotoWarningBox}>
        <div className={applicantDetailsContentstyles.applicantDetailsHeaderCardContentDetail}>
          Please upload a photo that was taken within the last 3 months.
        </div>
      </div>

      <div className={applicantDetailsContentstyles.photoHrLine}>
        <hr className={applicantDetailsContentstyles.photoHrLine}></hr>
      </div>
      {formData.image && (!faceDetected || !bgColorMatch) ? (
        <div className={applicantDetailsContentstyles.photoUploadError}>
          <div className={applicantDetailsContentstyles.photoUploadErrorBox}>
            <div>
              Your photo has been rejected for the following reasons:
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
              <p>Eyewear has been detected</p>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      ) : (
        <p></p>
      )}

      <div className={applicantDetailsContentstyles.flexContainer}>
        <span className={applicantDetailsContentstyles.uploadPhotoContainer}>
          <div className={applicantDetailsContentstyles.uploadPhotoContainerBox}>
            {formData.image && <img src={formData.image} alt="Processed" />}
          </div>

          <div className={applicantDetailsContentstyles.chooseFileText}>
            Maximum file size: 5 MB <br></br>
            Supported file types: JPG / PNG
          </div>
          <div className={applicantDetailsContentstyles.fileUploadWrapper}>
            <label htmlFor="file-upload" className={applicantDetailsContentstyles.chooseFileButton}>
              <div className={applicantDetailsContentstyles.chooseFileButtonText}>
                Choose photo
              </div>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }} // Hide the actual file input
            />
          </div>
        </span>
        <span className={applicantDetailsContentstyles.photosDosDontContainer}>
          <div className={applicantDetailsContentstyles.photosDosDontContainerPicsBox}>
            <span className={applicantDetailsContentstyles.picBox}>
              <div className={applicantDetailsContentstyles.picFrame}>
                <img src='/images/clear_pic.jpeg'></img>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                  <g clip-path="url(#clip0_923_17105)">
                    <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                  </g>
                  <defs>
                    <clipPath id="clip0_923_17105">
                      <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </span>
            <span className={applicantDetailsContentstyles.picBox}>
              <div className={applicantDetailsContentstyles.picFrame}>
                <img src='/images/clear_pic.jpeg'></img>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                  <g clip-path="url(#clip0_923_17105)">
                    <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                  </g>
                  <defs>
                    <clipPath id="clip0_923_17105">
                      <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </span>
            <span className={applicantDetailsContentstyles.picBox}>
              <div className={applicantDetailsContentstyles.picFrame}>
                <img src='/images/clear_pic.jpeg'></img>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                  <g clip-path="url(#clip0_923_17105)">
                    <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                  </g>
                  <defs>
                    <clipPath id="clip0_923_17105">
                      <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </span>
            <span className={applicantDetailsContentstyles.picBox}>
              <div className={applicantDetailsContentstyles.picFrame}>
                <img src='/images/clear_pic.jpeg'></img>

              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                  <g clip-path="url(#clip0_923_17105)">
                    <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                  </g>
                  <defs>
                    <clipPath id="clip0_923_17105">
                      <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </span>
            <span className={applicantDetailsContentstyles.picBox}>
              <div className={applicantDetailsContentstyles.picFrame}>
                <img src='/images/clear_pic.jpeg'></img>
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                  <g clip-path="url(#clip0_923_17105)">
                    <path d="M24 4.5C12.96 4.5 4 13.46 4 24.5C4 35.54 12.96 44.5 24 44.5C35.04 44.5 44 35.54 44 24.5C44 13.46 35.04 4.5 24 4.5ZM33.62 18.68L22.62 33.68C22.26 34.18 21.7 34.48 21.08 34.5C21.06 34.5 21.02 34.5 21 34.5C20.42 34.5 19.88 34.26 19.5 33.82L12.5 25.82C11.78 24.98 11.86 23.72 12.68 23C13.52 22.28 14.78 22.36 15.5 23.18L20.86 29.3L30.38 16.32C31.04 15.44 32.28 15.24 33.18 15.9C34.08 16.54 34.26 17.8 33.62 18.68Z" fill="#00695C" />
                  </g>
                  <defs>
                    <clipPath id="clip0_923_17105">
                      <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </span>
          </div>
        </span>
      </div>
      {/* {brightnessContrast && (
        <p>
          Brightness: {brightnessContrast.brightness}, Contrast: {brightnessContrast.contrast}
        </p>
      )} */}

    </div>
  );
};

export default ImageProcessing;
