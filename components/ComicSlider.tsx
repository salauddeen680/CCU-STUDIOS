"use client"

import React, { useEffect, useRef } from 'react'

interface Comic {
  id: string;
  title: string;
  coverUrl?: string;
  imageUrl?: string;
  image?: string;
  cover?: string;
  thumbnail?: string;
}

export default function ComicSlider({ comics }: { comics: Comic[] }) {
  // 🔥 Slider ke container ko track karne ke liye ref
  const sliderRef = useRef<HTMLDivElement>(null);

  // 🔄 Auto-play logic: Har 2 second mein automatic slide badlegi
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !comics || comics.length === 0) return;

    let scrollAmount = 0;
    const slideWidth = 224; // Ek card ki width (width + gap)
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    const autoScroll = setInterval(() => {
      if (scrollAmount >= maxScroll) {
        // Agar aakhiri comic tak pahunch gaya, toh wapas pehli comic par aa jaye
        scrollAmount = 0;
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Nahi toh aage badhta rahe
        scrollAmount += slideWidth;
        slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000); // ⏱️ 3000ms = 2 Second (Aap isey kam-zyada kar sakte ho)

    // Agar user khud hath se ghumaye, toh tracking automatic update ho jaye
    const handleUserScroll = () => {
      scrollAmount = slider.scrollLeft;
    };

    slider.addEventListener('scroll', handleUserScroll);

    // Cleanup: Jab page badle toh timer ruk jaye
    return () => {
      clearInterval(autoScroll);
      slider.removeEventListener('scroll', handleUserScroll);
    };
  }, [comics]);

  return (
    <div className="w-full bg-black py-8 px-4">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6 tracking-wider uppercase">
        Latest CCU Comics
      </h2>

      {/* Left-Right Scroll Window (With Slider Ref) */}
      <div 
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto py-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {comics && comics.map((comic) => {
          const currentImage = comic.coverUrl || comic.imageUrl || comic.image || comic.cover || comic.thumbnail || "/hero-cosmic.png";

          return (
            <div 
              key={comic.id} 
              className="flex-none w-[200px] md:w-[250px] snap-start bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-red-500/20"
            >
              {/* Comic Cover Image */}
              <a href={`/comics/${comic.id}`} className="block w-full h-[300px] md:h-[370px] relative">
                <img 
                  src={currentImage} 
                  alt={comic.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/hero-cosmic.png";
                  }}
                />
              </a>
              
              {/* Comic Title */}
              <div className="p-3 bg-zinc-950">
                <h3 className="text-white font-semibold text-sm md:text-base truncate">
                  {comic.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
