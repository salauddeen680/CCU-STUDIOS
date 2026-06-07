import React from 'react'

interface Comic {
  id: string;
  title: string;
  coverUrl: string;
}

export default function ComicSlider({ comics }: { comics: Comic[] }) {
  return (
    <div className="w-full bg-black py-8 px-4">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-6 tracking-wider uppercase">
        Latest CCU Comics
      </h2>

      {/* Left-Right Scroll Window */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-2">
        {comics && comics.map((comic) => (
          <div 
            key={comic.id} 
            className="flex-none w-[200px] md:w-[250px] snap-start bg-zinc-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-red-500/20"
          >
            {/* Comic Cover Image */}
            <a href={`/comics/${comic.id}`} className="block w-full h-[300px] md:h-[370px] relative">
              <img 
                src={comic.coverUrl || "/hero-cosmic.png"} 
                alt={comic.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </a>
            
            {/* Comic Title */}
            <div className="p-3 bg-zinc-950">
              <h3 className="text-white font-semibold text-sm md:text-base truncate">
                {comic.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
