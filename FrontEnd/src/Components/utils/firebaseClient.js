// firebaseClient.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let firebaseApp = null;
let firebaseAuth = null;

export const initializeFirebase = () => {
  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    console.log('Window undefined, skipping Firebase init');
    return { app: null, auth: null };
  }

  // If Firebase app and auth are already initialized, return them
  if (firebaseApp && firebaseAuth) {
    console.log("Returning already initialized Firebase app and auth");
    return { app: firebaseApp, auth: firebaseAuth };
  }

  // Firebase configuration from environment variables
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Initialize Firebase app
  try {
    firebaseApp = initializeApp(firebaseConfig);
    console.log("Firebase Initialized Successfully", firebaseApp);
  } catch (error) {
    console.error("Firebase Initialization Failed:", error);
  }

  // Initialize Firebase Auth only after Firebase app is successfully initialized
  try {
    if (firebaseApp) {
      firebaseAuth = getAuth(firebaseApp);
      console.log("Firebase Auth Initialized Successfully", firebaseAuth);
    } else {
      console.error("Firebase app is not initialized properly.");
    }
  } catch (error) {
    console.error("Firebase Auth Initialization Failed:", error);
  }

  return { app: firebaseApp, auth: firebaseAuth };
};
