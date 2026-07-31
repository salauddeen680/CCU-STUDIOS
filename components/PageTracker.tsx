"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase"; // Dhyan rahe yeh aapki firebase config ka sahi rasta ho
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Agar page load ho gaya hai, toh Firebase mein entry daal do
    if (!pathname) return;

    const recordView = async () => {
      try {
        await addDoc(collection(db, "pageViews"), {
          page: pathname, // Kaunsa page khola gaya hai (jaise: /comics/genesis-of-destruction)
          timestamp: serverTimestamp(), // Kis waqt khola gaya
          userType: "Guest / Visitor", // Bina login wale logo ke liye
        });
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    };

    // Har baar naya page khulne par entry save hogi
    recordView();
  }, [pathname]);

  return null; // Yeh screen par kuch nahi dikhayega, sirf background mein chalega
}

