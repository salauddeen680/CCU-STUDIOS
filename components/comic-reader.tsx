"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeftRight,
  Maximize,
  Lock,
} from "lucide-react"

type Props = {
  title: string
  pages: string[]
  isPaid?: boolean
}

export function ComicReader({ title, pages, isPaid = false }: Props) {
  const [index, setIndex] = useState(0)
  const [rtl, setRtl] = useState(true)
  const [chrome, setChrome] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  const total = pages.length
  // 8 pages tak free, 9th page se lock
  const showPaywall = isPaid && !isPremium && index >= 8

  // Razorpay Payment Handler
  const initiatePayment = async (amount: number) => {
    try {
      const res = await fetch("/api/create-order", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }) 
      });
      const data = await res.json();
      
      if (!data.orderId) throw new Error("Order creation failed");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.orderId,
        name: "CCU Studios",
        description: amount === 19 ? "Single Issue Access" : "VIP Monthly Membership",
        handler: function (response: any) {
          setIsPremium(true);
          alert("Payment Successful! Access Unlocked.");
        },
        theme: { color: "#dc2626" }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initiation failed. Please try again later.");
    }
  };

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => {
      let nextIndex = i + dir
      if (isPaid && !isPremium && nextIndex > 8) return 8
      return Math.min(Math.max(nextIndex, 0), total - 1)
    })
  }, [total, isPaid, isPremium])

  const next = useCallback(() => go(1), [go])
  const prev = useCallback(() => go(-1), [go])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showPaywall && ((e.key === "ArrowRight" && !rtl) || (e.key === "ArrowLeft" && rtl))) return
      if (e.key === "ArrowRight") rtl ? prev() : next()
      else if (e.key === "ArrowLeft") rtl ? next() : prev()
      else if (e.key === "Escape") window.history.back()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [rtl, next, prev, showPaywall])

  // Preload neighbours
  useEffect(() => {
    const preload = (i: number) => {
      if (i < 0 || i >= total) return
      const img = new Image()
      img.src = pages[i]
    }
    preload(index + 1)
    preload(index - 1)
  }, [index, pages, total])

  const progress = useMemo(() => (total ? ((index + 1) / total) * 100 : 0), [index, total])

  if (total === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background text-center">
        <p className="font-display text-lg">No pages uploaded yet</p>
        <Link href="/comics" className="text-sm text-primary underline">Back to comics</Link>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full select-none overflow-hidden bg-black">
      <div className="relative h-full w-full" onClick={() => setChrome((c) => !c)}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: rtl ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: rtl ? 40 : -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            drag={showPaywall ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (!showPaywall) {
                if (info.offset.x < -80) rtl ? prev() : next()
                else if (info.offset.x > 80) rtl ? next() : prev()
              }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={pages[index] || "/placeholder.svg"}
              alt={`${title} — page ${index + 1}`}
              loading="eager"
              className={`max-h-full max-w-full object-contain transition-all duration-700 ${showPaywall ? "blur-xl opacity-40 scale-105" : ""}`}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {showPaywall && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-900/20 border border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                <Lock className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="mb-2 font-display text-3xl font-black tracking-widest text-white uppercase drop-shadow-lg">Premium Access</h2>
              <p className="mb-8 max-w-md text-sm text-zinc-300 font-sans leading-relaxed">
                Aage ki bawal kahani aur epic cinematic action dekhne ke liye is issue ko khareedein ya CCU VIP Club ka hissa banein.
              </p>
              <div className="flex w-full max-w-sm flex-col gap-4">
                <button onClick={() => initiatePayment(19)} className="group relative w-full overflow-hidden rounded-full bg-red-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)]">Buy This Issue — ₹19</button>
                <button onClick={() => initiatePayment(69)} className="w-full rounded-full border border-zinc-700 bg-zinc-900/80 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-95">Join CCU VIP Club — ₹69/mo</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showPaywall && (
          <>
            <button aria-label="Previous area" onClick={(e) => { e.stopPropagation(); rtl ? next() : prev(); }} className="absolute inset-y-0 left-0 w-1/3 z-10" />
            <button aria-label="Next area" onClick={(e) => { e.stopPropagation(); rtl ? prev() : next(); }} className="absolute inset-y-0 right-0 w-1/3 z-10" />
          </>
        )}
      </div>

      <AnimatePresence>
        {chrome && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }} className="glass-strong absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-4 py-3">
            <Link href="/comics" className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-900/80 text-white hover:text-red-400 transition-colors border border-zinc-800"><X className="h-4 w-4" /></Link>
            <p className="line-clamp-1 flex-1 text-center font-sans tracking-wider text-sm font-bold text-white uppercase">{title}</p>
            <button onClick={(e) => { e.stopPropagation(); setRtl((r) => !r); }} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-2 text-[11px] font-bold text-white hover:text-primary transition-colors"><ArrowLeftRight className="h-4 w-4" />{rtl ? "RTL" : "LTR"}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chrome && (
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="glass-strong absolute inset-x-0 bottom-0 z-50 px-4 py-3">
            <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800"><div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            <div className="flex items-center justify-between">
              <button onClick={(e) => { e.stopPropagation(); prev(); }} disabled={index === 0} className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-bold text-white disabled:opacity-40 hover:bg-zinc-800 transition-all"><ChevronLeft className="h-4 w-4" /> Prev</button>
              <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 font-sans tracking-widest"><Maximize className="h-3.5 w-3.5" />{index + 1} / {total}</span>
              <button onClick={(e) => { e.stopPropagation(); next(); }} disabled={index === total - 1 || showPaywall} className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-bold text-white disabled:opacity-40 hover:bg-zinc-800 transition-all">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
