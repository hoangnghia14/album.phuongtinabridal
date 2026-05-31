import React from 'react';
import { StudioSettings } from '../types';

interface StudioHeaderProps {
  currentPage: string;
  onNavigate: (page: string, albumId?: string) => void;
  studioSettings?: StudioSettings;
}

export default function StudioHeader({ currentPage, onNavigate, studioSettings }: StudioHeaderProps) {
  const logoText = studioSettings?.logoText || 'Phương Tina';
  const logoSubtitle = studioSettings?.logoSubtitle || 'Bridal & Editorial Gallery';

  return (
    <header className="border-b border-stone-900 bg-stone-950/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo Section */}
        <div 
          className="flex flex-col items-center sm:items-start cursor-pointer group text-center sm:text-left"
          onClick={() => onNavigate('home')}
        >
          <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.4em] text-stone-100 group-hover:text-stone-300 transition-colors duration-300 uppercase italic">
            {logoText}
          </h1>
          <span className="text-[10px] tracking-[0.2em] text-stone-400 font-sans font-light uppercase mt-1">
            {logoSubtitle}
          </span>
        </div>

        {/* Navigation Elements */}
        <nav className="flex items-center gap-6 sm:gap-8 text-xs font-sans uppercase tracking-[0.25em] text-stone-400">
          <button
            id="nav-btn-home"
            type="button"
            onClick={() => onNavigate('home')}
            className={`transition-all duration-300 hover:text-stone-100 pb-1 border-b ${
              currentPage === 'home' 
                ? 'text-stone-100 border-stone-100 font-medium' 
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            Trang Chủ
          </button>
          
          <button
            id="nav-btn-albums"
            type="button"
            onClick={() => onNavigate('albums')}
            className={`transition-all duration-300 hover:text-stone-100 pb-1 border-b ${
              currentPage === 'albums' 
                ? 'text-stone-100 border-stone-100 font-medium' 
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            Tất Cả Album
          </button>
          
          <button
            id="nav-btn-admin"
            type="button"
            onClick={() => onNavigate('admin')}
            className={`px-5 py-2 border text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 rounded-none ${
              currentPage === 'admin' 
                ? 'border-stone-100 bg-stone-100 text-stone-950 font-medium shadow-lg' 
                : 'border-stone-800 bg-stone-900/40 text-stone-300 hover:border-stone-100 hover:bg-stone-100 hover:text-stone-950'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Quản trị viên
          </button>
        </nav>
      </div>
    </header>
  );
}
