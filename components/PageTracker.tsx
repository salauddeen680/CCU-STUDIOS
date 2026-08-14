"use client";

import { useEffect, useRef } from "react";
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

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (!pathname) return;

    // Admin routes ko track nahi karna
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Same route pe duplicate entry rokna
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const trackVisit = async () => {
      try {
        const user = auth.currentUser;
        const userEmail = user?.email || "Guest Reader";

        // Accurate Native Device Detection (No Network API Dependency)
        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        let device = "Desktop PC";
        if (/Android/i.test(ua)) device = "Android Mobile";
        else if (/iPhone/i.test(ua)) device = "iPhone";
        else if (/iPad/i.test(ua)) device = "iPad Tablet";

        // Browser Detection
        let browser = "Browser";
        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";

        // Native Timezone/Region (100% Reliable & Fast)
        let region = "Global";
        try {
          region = Intl.DateTimeFormat().resolvedOptions().timeZone || "Global";
        } catch {
          region = "Global";
        }

        // Direct Firestore Push
        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          userEmail: userEmail,
          isLoggedIn: !!user,
          device: device,
          browser: browser,
          location: region,
          referrer: typeof document !== "undefined" && document.referrer ? "Web Referrer" : "Direct Visit",
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Tracker save failed:", err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null;
}
