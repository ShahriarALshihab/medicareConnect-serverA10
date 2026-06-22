import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const initFirebaseAdmin = () => {
  
  if (getApps().length > 0) return;

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT_BASE64 is not set.");
    return;
  }

  const decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf-8");

  const serviceAccount = JSON.parse(decoded);

  initializeApp({
    credential: cert(serviceAccount),
  });

  console.log("Firebase Admin initialized");
};


export const getAdminAuth = () => getAuth();