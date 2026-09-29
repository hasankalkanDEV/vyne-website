import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This config is not secret — Firebase's web config is meant to be public;
// access is controlled by the Firestore security rules, not by hiding this.
const firebaseConfig = {
  apiKey: 'AIzaSyD0ghdPz9yVn-iolTTTRMvIL15HwRdH-Ao',
  authDomain: 'vyne-app2.firebaseapp.com',
  projectId: 'vyne-app2',
  storageBucket: 'vyne-app2.firebasestorage.app',
  messagingSenderId: '542135730721',
  appId: '1:542135730721:web:4a8fbc166e82c870715960',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
