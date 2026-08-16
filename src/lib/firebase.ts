import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

// Placeholder values still let initializeApp succeed — real failures only
// surface when a Firestore call actually goes out, which callers guard
// against via isFirebaseConfigured.
const app = initializeApp(
  isFirebaseConfigured ? firebaseConfig : { projectId: 'unconfigured-project' },
)

export const db = getFirestore(app)
