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

// 🛡️ Owner / Admin Emails list jo tracking mein 100% IGNORE hongi
const IGNORED_ADMIN_EMAILS = [
  "admin@ccustudios.com",
  "srk042221@gmail.com"
];

export default function PageTracker() {
  const pathname = usePathname();
  const tracked = useRef("");

  useEffect(() => {
    if (!pathname) return;

    // 🛑 1. Admin/API Routes Ignore
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    if (tracked.current === pathname) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const email = user?.email?.toLowerCase() || "";

      // 🛑 2. Creator / Admin ki apni visit kabhi record nahi hogi
      if (IGNORED_ADMIN_EMAILS.some((adminEmail) => email.includes(adminEmail.toLowerCase()))) {
        return;
      }

      tracked.current = pathname;
      const userDisplay = user ? (user.email || user.displayName || "Member") : "Guest / Visitor";

      // 📱 Accurate Device Detection
      const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
      let device = "Desktop";
      if (/Android/i.test(userAgent)) device = "Android Mobile";
      else if (/iPhone/i.test(userAgent)) device = "iPhone";
      else if (/iPad/i.test(userAgent)) device = "iPad Tablet";

      // 🌐 Accurate Browser Detection
      let browser = "Chrome";
      if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Edg/")) browser = "Edge";
      else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
      else if (userAgent.includes("OPR") || userAgent.includes("Opera")) browser = "Opera";

      // 🌍 100% Working Location API (City, Region, Country)
      let location = "India (Web)";
      try {
        const res = await fetch("https://api.country.is/");
        if (res.ok) {
          const data = await res.json();
          location = data.country ? `Country: ${data.country}` : "Global Web";
        }
      } catch {
        location = "Global Web";
      }

      // Referrer source
      let source = "Direct Visit";
      if (typeof document !== "undefined" && document.referrer) {
        if (document.referrer.includes("google")) source = "Google Search";
        else if (document.referrer.includes("instagram")) source = "Instagram";
        else if (document.referrer.includes("youtube")) source = "YouTube";
        else source = "External Link";
      }

      try {
        await addDoc(collection(db, "pageViews"), {
          page: pathname,
          timestamp: serverTimestamp(),
          userEmail: userDisplay,
          isLoggedIn: !!user,
          device,
          browser,
          location,
          referrer: source,
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
