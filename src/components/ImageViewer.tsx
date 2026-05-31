import React, { useState, useEffect, useRef } from 'react';
import { Photo } from '../types';

interface ImageViewerProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  showWatermark: boolean;
  watermarkText: string;
  albumSlug: string;
}

export default function ImageViewer({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  showWatermark,
  watermarkText,
  albumSlug,
}: ImageViewerProps) {
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const activePhoto = photos[currentIndex];
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos]);

  // Slideshow timer
  useEffect(() => {
    if (isSlideshowPlaying) {
      slideshowTimerRef.current = setTimeout(() => {
        handleNext();
      }, 3500);
    } else {
      if (slideshowTimerRef.current) {
        clearTimeout(slideshowTimerRef.current);
      }
    }
    return () => {
      if (slideshowTimerRef.current) clearTimeout(slideshowTimerRef.current);
    };
  }, [isSlideshowPlaying, currentIndex]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  };

  const toggleSlideshow = () => {
    setIsSlideshowPlaying(!isSlideshowPlaying);
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?album=${albumSlug}&photo=${activePhoto.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Helper function to handle download trigger safely
  const handleDownload = async () => {
    try {
      if (activePhoto.url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = activePhoto.url;
        link.download = `thanhthao_studio_${activePhoto.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      const response = await fetch(activePhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thanhthao_studio_${activePhoto.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback
      window.open(activePhoto.url, '_blank');
    }
  };

  if (!activePhoto) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0c0a09]/98 object-contain">
      {/* Top Bar controls */}
      <div className="w-full bg-gradient-to-b from-[#0c0a09]/90 to-transparent p-4 flex items-center justify-between z-10">
        {/* Detail Photo Metadata */}
        <div className="text-left font-sans text-xs tracking-wider text-stone-400">
          <span className="font-serif text-sm text-stone-100 italic block truncate max-w-xs sm:max-w-md">
            {activePhoto.title || 'Untitled Moment'}
          </span>
          <span className="font-mono text-stone-500 mt-0.5 block text-[10px] uppercase tracking-widest">
            Ảnh {currentIndex + 1} / {photos.length} — ID: {activePhoto.id}
          </span>
        </div>

        {/* Toolbar Interaction */}
        <div className="flex items-center gap-3">
          {/* Pause / Play slides */}
          <button
            id="slideshow-toggle-btn"
            type="button"
            onClick={toggleSlideshow}
            className={`p-2.5 rounded-none border transition-all duration-300 ${
              isSlideshowPlaying
                ? 'bg-stone-100 text-stone-950 border-stone-100 font-medium'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
            }`}
            title={isSlideshowPlaying ? 'Tạm dừng slideshow' : 'Chạy slideshow'}
          >
            {isSlideshowPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Copy deep share link */}
          <button
            id="share-deep-link-btn"
            type="button"
            onClick={handleCopyLink}
            className={`p-2.5 rounded-none border transition-all duration-300 ${
              copied
                ? 'bg-[#1e291e] border-[#344d34] text-emerald-400'
                : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
            }`}
            title="Sao chép link riêng tư ảnh này"
          >
            {copied ? (
              <span className="text-[10px] uppercase tracking-wider px-2 font-medium">Đã chép link</span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186l5.566-3.235m-5.566 5.421l5.566 3.235m-.228-10.315a2.25 2.25 0 1 1 3.186 3.185 2.25 2.25 0 0 1-3.186-3.185Zm3.186 10.315a2.25 2.25 0 1 1-3.186 3.186 2.25 2.25 0 0 1 3.186-3.186Z" />
              </svg>
            )}
          </button>

          {/* Instant Photo Download */}
          <button
            id="download-photo-btn"
            type="button"
            onClick={handleDownload}
            className="p-2.5 rounded-none bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all duration-300"
            title="Tải ảnh này xuống"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>

          {/* Close viewer */}
          <button
            id="close-viewer-btn"
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-none bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all duration-300"
            title="Đóng chế độ phóng to (Esc)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Image View Section */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Navigation - Left Arrow */}
        <button
          id="prev-photo-btn"
          type="button"
          onClick={handlePrev}
          className="absolute left-4 z-20 p-3 bg-stone-900/65 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-950 rounded-none transition-all duration-300 hidden sm:block cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* The active viewport photo container */}
        <div className="relative max-w-full max-h-[80vh] flex items-center justify-center select-none overflow-hidden">
          <img
            src={activePhoto.url}
            alt={activePhoto.title || 'Studio Photo'}
            className="max-w-full max-h-[75vh] object-contain rounded-none transition-all duration-500 shadow-2xl scale-[0.99] border border-stone-900"
            referrerPolicy="no-referrer"
          />

          {/* Luxury Watermarks overlay */}
          {showWatermark && (
            <>
              <div className="watermark-overlay text-sm sm:text-base">{watermarkText}</div>
              <div className="watermark-large pointer-events-none text-white/5 whitespace-nowrap uppercase tracking-[0.45em] text-[2rem] text-center select-none rotate-[-25deg]">{watermarkText}</div>
            </>
          )}
        </div>

        {/* Navigation - Right Arrow */}
        <button
          id="next-photo-btn"
          type="button"
          onClick={handleNext}
          className="absolute right-4 z-20 p-3 bg-stone-900/65 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-950 rounded-none transition-all duration-300 hidden sm:block cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Swipe support instruction on mobile */}
      <div className="sm:hidden text-center text-[10px] uppercase text-stone-600 font-mono tracking-widest pb-4">
        Nhấn trái / phải màn hình để tuần tự xem ảnh
      </div>

      {/* Mobile-only hotzones for navigation */}
      <div className="sm:hidden absolute top-24 bottom-16 left-0 w-1/3 z-10 cursor-alias" onClick={handlePrev} />
      <div className="sm:hidden absolute top-24 bottom-16 right-0 w-1/3 z-10 cursor-alias" onClick={handleNext} />

      {/* Filmstrip thumbnails indicator footer (horizontal slideshow ticker) */}
      <div className="w-full bg-stone-950 border-t border-stone-900 p-3 hidden md:flex items-center justify-center gap-2 max-w-full overflow-x-auto">
        {photos.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(idx)}
            className={`relative rounded-none overflow-hidden aspect-video h-10 border transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'border-white scale-110 opacity-100 z-10'
                : 'border-stone-900 opacity-40 hover:opacity-100 hover:scale-105'
            }`}
          >
            <img src={item.url} alt="Strip Thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
