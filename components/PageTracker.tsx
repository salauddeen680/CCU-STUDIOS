"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
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
  const tracked = useRef("");

  useEffect(() => {
    if (!pathname) return;

    // 🛑 FILTER 1: Admin aur internal API routes ko track nahi karna
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    if (tracked.current === pathname) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      tracked.current = pathname;
      
      const userEmail = user ? (user.email || user.displayName || "Logged In User") : "Guest / Visitor";

      // 🛑 FILTER 2: Admin/Owner ka apna session ignore karna
      if (userEmail.toLowerCase().includes("admin@ccustudios.com")) {
        return;
      }

      // 📱 Device & Browser Detection
      const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const device = isMobile ? "Mobile" : "Desktop";
      
      let browser = "Chrome";
      if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("Edge")) browser = "Edge";

      // 🌍 Location Detection
      let location = "Global";
      try {
        const locRes = await fetch("https://ipapi.co/json/", { cache: "force-cache" });
        if (locRes.ok) {
          const locData = await locRes.json();
          location = `${locData.city || ""}, ${locData.country_name || ""}`.trim() || "Global";
        }
      } catch {
        location = "Global";
      }

      try {
        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          timestamp: serverTimestamp(),
          userEmail: userEmail,
          isLoggedIn: !!user,
          device,
          browser,
          location,
          referrer: typeof document !== "undefined" ? (document.referrer || "Direct Visit") : "Direct Visit",
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    });

    return () => unsubscribe();
  }, [pathname]);

  return null;
}
