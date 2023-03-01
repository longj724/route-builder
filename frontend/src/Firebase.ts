// External Dependencies
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  browserSessionPersistence,
  signInWithPopup,
  signOut,
  setPersistence,
} from 'firebase/auth';
import { getFirestore, getDoc, doc, setDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'route-builder-374800.firebaseapp.com',
  projectId: 'route-builder-374800',
  storageBucket: 'route-builder-374800.appspot.com',
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: '1:362643627383:web:d5a71ae94441721fba9572',
  measurementId: 'G-37586XZ1V6',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<boolean> => {
  await setPersistence(auth, browserSessionPersistence);
  const result = await signInWithPopup(auth, provider);

  const userDoc = doc(db, `users/${result.user?.uid}`);
  const userSnapshot = await getDoc(userDoc);

  if (!userSnapshot.exists()) {
    const userDetails = {
      displayName: result?.user.displayName,
    };

    setDoc(userDoc, userDetails);
  }

  return result.user !== null;
};

export const signOutOfProfile = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};
