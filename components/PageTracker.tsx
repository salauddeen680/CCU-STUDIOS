"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

// Developer / Owner list
const BLOCKED_ADMINS = ["admin@ccustudios.com", "srk042221@gmail.com"];

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // 1. Admin/Internal routes ko track mat karo
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const recordVisit = async () => {
      try {
        const currentUser = auth.currentUser;
        const email = (currentUser?.email || "").toLowerCase();

        // 2. Agar Creator/Admin khud dekh raha hai toh skip
        if (BLOCKED_ADMINS.some((adm) => email.includes(adm.toLowerCase()))) {
          return;
        }

        const userTag = currentUser ? (currentUser.email || currentUser.displayName || "Member") : "Guest Reader";

        // Accurate Device
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        let device = "Desktop PC";
        if (/Android/i.test(ua)) device = "Android Mobile";
        else if (/iPhone/i.test(ua)) device = "iPhone";
        else if (/iPad/i.test(ua)) device = "iPad Tablet";

        // Accurate Browser
        let browser = "Web";
        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";

        // Real Timezone/Country
        let region = "Global";
        try {
          region = Intl.DateTimeFormat().resolvedOptions().timeZone || "Global";
        } catch {
          region = "Global";
        }

        // Direct Push to Firestore
        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          userEmail: userTag,
          isLoggedIn: !!currentUser,
          device: device,
          browser: browser,
          location: region,
          referrer: typeof document !== "undefined" && document.referrer ? "External Web" : "Direct Visit",
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.error("Traffic logger error:", e);
      }
    };

    recordVisit();
  }, [pathname]);

  return null;
}
