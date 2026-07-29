"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BookOpen, ChevronLeft, Layers, Video, ChevronDown, ChevronUp, Lock, Loader2 } from "lucide-react"
import { useComic } from "@/lib/data"
import { Comments } from "./comments"

interface VideoLink {
  id: string
  title: string
  url: string
  posterUrl: string
}

export function ComicDetail({ id }: { id: string }) {
  const { comic, loading } = useComic(id)
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 🛡️ RAZORPAY STATE
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    async function fetchSocialLinks() {
      try {
        const res = await fetch("https://ccu-studios.vercel.app/api/social-links")
        if (res.ok) {
          const data = await res.json()
          setVideoLinks(data)
        }
      } catch (error) {
        console.error("Failed to load video links", error)
      }
    }
    fetchSocialLinks()
  }, [])

  // 💳 RAZORPAY SCRIPT LOADER
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  // 💸 RAZORPAY PAYMENT HANDLER
  const handlePayment = async () => {
    setIsProcessingPayment(true)
    
    const res = await loadRazorpayScript()
    if (!res) {
      alert("Razorpay SDK failed to load. Please check your connection.")
      setIsProcessingPayment(false)
      return
    }

    // Razorpay Options Setup
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // ⚠️ Apna Razorpay Key yahan daalna
      amount: 4900, // Amount in paise (e.g., 4900 = ₹49.00)
      currency: "INR",
      name: "CCU Studios",
      description: `Unlock Comic: ${comic?.title}`,
      image: comic?.cover || "https://ccu-studios.vercel.app/logo.png", // Aapka logo ya comic cover
      handler: function (response: any) {
        // Payment successful hone ke baad kya hoga:
        console.log("Payment ID:", response.razorpay_payment_id)
        alert(`Payment Successful! 🎉\nPayment ID: ${response.razorpay_payment_id}`)
        // TODO: Yahan backend call karke user ka access save kar sakte ho
      },
      prefill: {
        name: "", // User ka naam
        email: "", // User ka email
        contact: "", // User ka number
      },
      theme: {
        color: "#ca8a04", // Aapke CCU theme ka yellow color
      },
    }

    const paymentObject = new (window as any).Razorpay(options)
    paymentObject.open()
    
    paymentObject.on("payment.failed", function (response: any) {
      alert("Payment Failed. Reason: " + response.error.description)
    })

    setIsProcessingPayment(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="skeleton mb-4 h-6 w-40 rounded" />
        <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
          <div className="skeleton aspect-[3/4] rounded-2xl" />
          <div className="space-y-3">
            <div className="skeleton h-8 w-2/3 rounded" />
            <div className="skeleton h-24 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="font-display text-xl">Comic not found</p>
        <Link href="/comics" className="mt-2 inline-block text-sm text-primary underline">
          Back to comics
        </Link>
      </div>
    )
  }

  const cover = comic.cover || comic.images?.[0]
  const descriptionText = comic.description || ""
  const isLongText = descriptionText.length > 180
  
  // 🛡️ MAIN LOGIC: Yahan hum check kar rahe hain ki comic paid hai ya nahi
  const isPremium = comic.isPaid === true || comic.paid === true

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/comics"
        className="mb-5 inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> All comics
      </Link>

      <div className="grid gap-6 sm:grid-cols-[260px_1fr]">
        <div className="hover-glow overflow-hidden rounded-2xl border border-border bg-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover || "/placeholder.svg?height=520&width=390&query=comic%20cover"}
            alt={comic.title}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            {comic.ultimate && (
              <span className="inline-block rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                Ultimate Comic
              </span>
            )}
            <h1 className="mt-2 text-balance font-display text-2xl font-bold sm:text-3xl">
              {comic.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> {comic.images?.length || 0} pages
              </span>
            </div>

            {/* 📝 Summary Block */}
            <div className="mt-4">
              <p className={`text-sm leading-relaxed text-foreground/85 transition-all ${!isExpanded && isLongText ? "line-clamp-3" : ""}`}>
                {descriptionText}
              </p>
              
              {isLongText && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline focus:outline-none"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="h-3 w-3" /></>
                  ) : (
                    <>Read More <ChevronDown className="h-3 w-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            {/* 🚦 PAID VS FREE BUTTON LOGIC */}
            {isPremium ? (
              <div className="flex flex-col sm:flex-row gap-3">
                {/* 📖 9-Page Preview Button (For Paid Comics) */}
                <Link
                  href={`/comics/${comic.id}/read`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-zinc-700"
                >
                  <BookOpen className="h-4 w-4" /> Read Preview
                </Link>
                
                {/* 🔒 Premium Unlock Button (RAZORPAY) */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-yellow-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {isProcessingPayment ? "Processing..." : "Unlock Full Comic"}
                </button>
              </div>
            ) : (
              /* 🟢 Free Full Comic Button */
              <Link
                href={`/comics/${comic.id}/read`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 sm:w-auto"
              >
                <BookOpen className="h-4 w-4" /> Read Full Comic (Free)
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 🔴 Official Videos & Social Updates Banners */}
      {videoLinks.length > 0 && (
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="font-display text-xl font-bold tracking-wide flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" /> Official Videos & Social Updates
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            {videoLinks.map((link) => (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                key={link.id}
                className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary hover:shadow-glow"
              >
                <div className="aspect-[16/6] w-full overflow-hidden sm:aspect-[16/5]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={link.posterUrl || "/placeholder.svg?height=300&width=800&query=video%20thumbnail"}
                    alt={link.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="font-display text-base font-bold text-white sm:text-lg tracking-wide group-hover:text-primary transition">
                    {link.title}
                  </h3>
                  <span className="mt-1 inline-block text-xs font-medium text-muted uppercase tracking-wider">
                    Click to Open on Social Media 🚀
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <Comments parentId={comic.id} parentType="comic" />
    </div>
  )
}
