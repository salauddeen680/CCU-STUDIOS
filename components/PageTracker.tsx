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
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const BLOCKED_ADMINS = ["admin@ccustudios.com", "srk042221@gmail.com"];

export default function PageTracker() {
  const pathname = usePathname();
  const lastPath = useRef("");

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const recordVisit = async () => {
      try {
        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        const currentUser = auth?.currentUser;
        const email = (currentUser?.email || "").toLowerCase();

        if (BLOCKED_ADMINS.some((adm) => email.includes(adm.toLowerCase()))) {
          return;
        }

        const userTag = currentUser ? (currentUser.email || currentUser.displayName || "Member") : "Guest Reader";

        const ua = navigator?.userAgent || "";
        let device = "Desktop PC";
        if (/Android/i.test(ua)) device = "Android Mobile";
        else if (/iPhone/i.test(ua)) device = "iPhone";
        else if (/iPad/i.test(ua)) device = "iPad Tablet";

        let browser = "Browser";
        if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if (ua.includes("Edg")) browser = "Edge";

        let region = "Global";
        try {
          region = Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || "Global";
        } catch {
          region = "Global";
        }

        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          userEmail: userTag,
          isLoggedIn: !!currentUser,
          device: device,
          browser: browser,
          location: region,
          referrer: document?.referrer ? "Web Referrer" : "Direct Visit",
          timestamp: serverTimestamp(),
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Tracker log error:", err);
      }
    };

    const timer = setTimeout(recordVisit, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
