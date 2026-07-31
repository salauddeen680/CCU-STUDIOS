"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// 🔥 Firebase Config Setup
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function PageTracker() {
  const pathname = usePathname();
  const tracked = useRef(""); // Double entry rokne ke liye

  useEffect(() => {
    if (!pathname) return;
    if (tracked.current === pathname) return; // Agar same page dobara render ho raha hai toh ruk jao

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      tracked.current = pathname;
      
      // 🔥 Agar user login hai toh uski Email/Name, warna Guest
      const userInfo = user ? (user.email || user.displayName || "Logged In User") : "Guest / Visitor";

      try {
        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          timestamp: serverTimestamp(),
          userEmail: userInfo, // Yahan asli ID save hogi
        });
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  return null;
}
