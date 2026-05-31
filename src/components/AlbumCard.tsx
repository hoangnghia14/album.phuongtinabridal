import React from 'react';
import { Album } from '../types';

interface AlbumCardProps {
  key?: string | number;
  album: Album;
  onOpen: (id: string) => void;
}

export default function AlbumCard({ album, onOpen }: AlbumCardProps) {
  const isProtected = !!album.password;
  const coverImage = album.coverUrl || (album.images && album.images[0]?.url) || '';

  return (
    <div 
      id={`album-card-${album.id}`}
      onClick={() => onOpen(album.id)}
      className="group relative h-[380px] sm:h-[450px] overflow-hidden rounded-none bg-stone-900/40 border border-stone-900 cursor-pointer transition-all duration-500 hover:border-stone-750 hover:scale-[1.002]"
    >
      {/* Background Image with vintage-sunset-bridal zoom overlay */}
      <div className="absolute inset-0 bg-stone-950 flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt={album.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center border border-stone-900 bg-stone-900/10">
            <span className="font-serif text-md text-amber-500/30 tracking-[0.25em] italic uppercase">
              PHƯƠNG TINA BRIDAL
            </span>
            <span className="text-[9px] text-stone-600 font-mono tracking-widest mt-2 uppercase">
              CHƯA ĐĂNG HÌNH ẢNH
            </span>
          </div>
        )}
        {/* Luxury Vignette and Bottom Dark-fade Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      </div>

      {/* Security lock indicator pill upper right */}
      {isProtected && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-none bg-stone-950/90 backdrop-blur-md border border-stone-800 flex items-center gap-1.5 text-[10px] uppercase font-mono text-stone-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-3.5 h-3.5 text-stone-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Mã bảo mật
        </div>
      )}

      {/* Location tag upper-left */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-none bg-stone-950/90 backdrop-blur-md border border-stone-800 text-[10px] uppercase font-mono text-stone-300">
        📍 {album.location}
      </div>

      {/* Card Content & Meta Details at Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end">
        {/* Date / Stamp Tag */}
        <span className="font-mono text-[11px] text-stone-400 tracking-widest uppercase">
          {album.date} — {album.images.length} BỨC ẢNH
        </span>

        {/* Title */}
        <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-stone-100 mt-1.5 group-hover:text-white transition-colors duration-300 italic">
          {album.title}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs sm:text-sm text-stone-400 font-light mt-2 line-clamp-2 leading-relaxed">
          {album.description}
        </p>

        {/* Call to action arrow display on hover */}
        <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-light text-stone-200 flex items-center gap-2">
            MỞ BỘ ALBUM KHÁCH HÀNG
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-4 h-4 text-stone-200 transform group-hover:translate-x-1.5 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
