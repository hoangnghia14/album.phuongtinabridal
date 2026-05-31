import React, { useMemo } from 'react';
import { Photo } from '../types';

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  showWatermark: boolean;
  watermarkText: string;
  isAdminMode?: boolean;
  onDeletePhoto?: (photoId: string) => void;
  onSetCover?: (photoUrl: string) => void;
  coverUrl?: string;
}

export default function MasonryGrid({
  photos,
  onPhotoClick,
  favorites,
  onToggleFavorite,
  showWatermark,
  watermarkText,
  isAdminMode,
  onDeletePhoto,
  onSetCover,
  coverUrl
}: MasonryGridProps) {
  // Split photos into columns dynamically depending on screens
  // We can do standard grid-cols with flex columns or pure Tailwind columns
  // Tailwind's columns-1 sm:columns-2 md:columns-3 is great, but sometimes messes up item order or grouping.
  // Using flex columns grouped by index modulo screen columns is highly robust and beautiful!
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-500">
      {/* Col 1 */}
      <div className="flex flex-col gap-6">
        {photos.filter((_, idx) => idx % 3 === 0).map((photo) => {
          const originalIndex = photos.findIndex(p => p.id === photo.id);
          return (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={originalIndex}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={onToggleFavorite}
              onPhotoClick={onPhotoClick}
              showWatermark={showWatermark}
              watermarkText={watermarkText}
              isAdminMode={isAdminMode}
              onDeletePhoto={onDeletePhoto}
              onSetCover={onSetCover}
              isCover={coverUrl === photo.url}
            />
          );
        })}
      </div>

      {/* Col 2 */}
      <div className="flex flex-col gap-6">
        {photos.filter((_, idx) => idx % 3 === 1).map((photo) => {
          const originalIndex = photos.findIndex(p => p.id === photo.id);
          return (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={originalIndex}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={onToggleFavorite}
              onPhotoClick={onPhotoClick}
              showWatermark={showWatermark}
              watermarkText={watermarkText}
              isAdminMode={isAdminMode}
              onDeletePhoto={onDeletePhoto}
              onSetCover={onSetCover}
              isCover={coverUrl === photo.url}
            />
          );
        })}
      </div>

      {/* Col 3 */}
      <div className="flex flex-col gap-6">
        {photos.filter((_, idx) => idx % 3 === 2).map((photo) => {
          const originalIndex = photos.findIndex(p => p.id === photo.id);
          return (
            <PhotoItem
              key={photo.id}
              photo={photo}
              index={originalIndex}
              isFavorite={favorites.includes(photo.id)}
              onToggleFavorite={onToggleFavorite}
              onPhotoClick={onPhotoClick}
              showWatermark={showWatermark}
              watermarkText={watermarkText}
              isAdminMode={isAdminMode}
              onDeletePhoto={onDeletePhoto}
              onSetCover={onSetCover}
              isCover={coverUrl === photo.url}
            />
          );
        })}
      </div>
    </div>
  );
}

interface PhotoItemProps {
  key?: string | number;
  photo: Photo;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onPhotoClick: (index: number) => void;
  showWatermark: boolean;
  watermarkText: string;
  isAdminMode?: boolean;
  onDeletePhoto?: (photoId: string, e: React.MouseEvent) => void;
  onSetCover?: (photoUrl: string, e: React.MouseEvent) => void;
  isCover?: boolean;
}

function PhotoItem({
  photo,
  index,
  isFavorite,
  onToggleFavorite,
  onPhotoClick,
  showWatermark,
  watermarkText,
  isAdminMode,
  onDeletePhoto,
  onSetCover,
  isCover
}: PhotoItemProps) {
  return (
    <div 
      id={`photo-card-${photo.id}`}
      className="group relative overflow-hidden bg-stone-900/40 border border-stone-900 rounded-none cursor-pointer transition-all duration-300 hover:border-stone-750 hover:scale-[1.002]"
      onClick={() => onPhotoClick(index)}
    >
      <div className="relative overflow-hidden w-full aspect-auto">
        <img
          src={photo.url}
          alt={photo.title || 'Wedding photography'}
          className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Vintage Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a09]/90 via-transparent to-[#0c0a09]/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Watermarks */}
        {showWatermark && (
          <>
            <div className="watermark-overlay">{watermarkText}</div>
            <div className="watermark-large select-none">{watermarkText}</div>
          </>
        )}

        {/* Top bar control inside hover image: favorite count and details */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
          {isAdminMode && onDeletePhoto && (
            <button
              type="button"
              className="p-2 rounded-none bg-rose-950/90 text-rose-300 hover:text-white hover:bg-rose-900 border border-rose-900/50 backdrop-blur-md transition-all duration-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePhoto(photo.id, e);
              }}
              title="Xóa ảnh khỏi album"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          )}

          {isAdminMode && onSetCover && (
            <button
              type="button"
              className={`p-2 text-[10px] tracking-wider uppercase font-sans font-medium rounded-none backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isCover
                  ? 'bg-amber-500 text-stone-950 border border-amber-600 font-bold'
                  : 'bg-stone-950/80 text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-850'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetCover(photo.url, e);
              }}
              title={isCover ? "Đang là ảnh bìa" : "Chọn làm ảnh bìa Album"}
            >
              {isCover ? '★ Ảnh Bìa' : '☆ Bìa'}
            </button>
          )}

          <button
            id={`fav-btn-${photo.id}`}
            type="button"
            className={`p-2 rounded-none backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isFavorite
                ? 'bg-[#8c2525] text-stone-100 border border-red-700 font-medium'
                : 'bg-stone-950/80 text-stone-300 hover:text-stone-100 hover:bg-stone-900 border border-stone-850'
            }`}
            onClick={(e) => onToggleFavorite(photo.id, e)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isFavorite ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Title details at the bottom of card on hover */}
        <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <p className="font-serif text-sm tracking-widest text-stone-100 italic truncate">
            {photo.title || 'Wedding moment'}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-stone-400 mt-1 font-mono">
            {photo.aspect === 'portrait' ? 'Chân dung' : 'Góc rộng'} — Photo ID: {photo.id}
          </p>
        </div>
      </div>
    </div>
  );
}
