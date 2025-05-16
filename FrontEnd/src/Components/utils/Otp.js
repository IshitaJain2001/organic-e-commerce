// otpHelper.js
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
  } from 'firebase/auth';
  import { initializeFirebase } from './firebaseClient';
  
  // Function to set up reCAPTCHA
  const setupRecaptcha = (retries = 3, delay = 1000) => {
    // Check if we are on the client-side (browser)
    if (typeof window === 'undefined') return Promise.resolve(null);
  
    const { auth } = initializeFirebase(); // Get Firebase auth instance
  
    // If Firebase auth is not initialized
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return Promise.reject(new Error('Firebase Auth not initialized'));
    }
  
    // If reCAPTCHA is already initialized, return it
    if (window.recaptchaVerifier) {
      return Promise.resolve(window.recaptchaVerifier);
    }
  
    // Get the container for reCAPTCHA
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.error('reCAPTCHA container not found');
      return Promise.reject(new Error('reCAPTCHA container not found'));
    }
  
    // Function to wait until grecaptcha is ready
    const waitForGrecaptcha = () =>
      new Promise((resolve, reject) => {
        const check = (attempts = 10) => {
          if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
            resolve();
          } else if (attempts <= 0) {
            reject(new Error('grecaptcha not ready after max attempts'));
          } else {
            setTimeout(() => check(attempts - 1), 500); // Retry every 500ms
          }
        };
        check();
      });
  
    return new Promise((resolve, reject) => {
      // Wait for grecaptcha to load before rendering
      waitForGrecaptcha()
        .then(() => {
          // Initialize RecaptchaVerifier once grecaptcha is ready
          const verifier = new RecaptchaVerifier(
            'recaptcha-container',
            {
              size: 'invisible', // Invisible reCAPTCHA
              callback: () => {
                console.log('reCAPTCHA solved');
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
              },
            },
            auth
          );
  
          window.recaptchaVerifier = verifier; // Store the verifier globally
  
          // Render reCAPTCHA widget
          verifier
            .render()
            .then((widgetId) => {
              console.log('reCAPTCHA rendered with widget ID:', widgetId);
              resolve(verifier); // Return the verifier when done
            })
            .catch((error) => {
              console.error('reCAPTCHA render error:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error('grecaptcha failed to load:', error);
          // Retry logic for loading grecaptcha
          if (retries > 0) {
            setTimeout(() => {
              setupRecaptcha(retries - 1, delay * 2)
                .then(resolve)
                .catch(reject);
            }, delay); // Delay before retrying
          } else {
            reject(error); // If max retries reached, reject
          }
        });
    });
  };
  
  // Export functions for OTP and reCAPTCHA
  export { setupRecaptcha, signInWithPhoneNumber, PhoneAuthProvider };
  