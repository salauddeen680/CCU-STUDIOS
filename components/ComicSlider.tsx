"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !comics || comics.length === 0) return;

    let scrollAmount = 0;
    const slideWidth = 224;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    const autoScroll = setInterval(() => {
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollAmount += slideWidth;
        slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000);

    const handleUserScroll = () => {
      scrollAmount = slider.scrollLeft;
    };

    slider.addEventListener('scroll', handleUserScroll);

    return () => {
      clearInterval(autoScroll);
      slider.removeEventListener('scroll', handleUserScroll);
    };
  }, [comics]);

  return (
    <div className="w-full bg-black py-8 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6 tracking-wider uppercase">
        Latest CCU Comics
      </h2>

      <div 
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto py-4 px-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {comics && comics.map((comic, idx) => {
          const currentImage = comic.coverUrl || comic.imageUrl || comic.image || comic.cover || comic.thumbnail || "/hero-cosmic.png";
          const isPriority = idx < 3;

          return (
            <div 
              key={comic.id} 
              className="flex-none w-[200px] md:w-[250px] snap-start bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-red-500/20"
            >
              {/* Next.js Optimized Image Box */}
              <Link href={`/comics/${comic.id}`} className="block w-full h-[300px] md:h-[370px] relative bg-zinc-950">
                <Image 
                  src={currentImage} 
                  alt={comic.title || "CCU Comic"}
                  fill
                  priority={isPriority}
                  loading={isPriority ? undefined : "lazy"}
                  quality={85}
                  sizes="(max-width: 768px) 200px, 250px"
                  className="object-cover"
                />
              </Link>
              
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
