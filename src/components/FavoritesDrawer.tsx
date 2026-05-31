import React, { useState } from 'react';
import { Photo } from '../types';

interface FavoritesDrawerProps {
  favoriteIds: string[];
  photos: Photo[];
  albumId: string;
  onRemoveFavorite: (id: string) => void;
  onSubmitFavorites: (clientName: string, clientPhone: string, notes: string) => void;
  onClearAll: () => void;
}

export default function FavoritesDrawer({
  favoriteIds,
  photos,
  albumId,
  onRemoveFavorite,
  onSubmitFavorites,
  onClearAll,
}: FavoritesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const favoritePhotos = photos.filter((photo) => favoriteIds.includes(photo.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || favoritePhotos.length === 0) return;

    setIsSubmitting(true);
    // Mimic database call
    setTimeout(() => {
      onSubmitFavorites(clientName, clientPhone, notes);
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setIsOpen(false);
        setClientName('');
        setClientPhone('');
        setNotes('');
      }, 3500);
    }, 1200);
  };

  if (favoriteIds.length === 0) return null;

  return (
    <div id="favorites-tray-container" className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 font-sans">
      {/* Floating Pill Trigger when closed */}
      {!isOpen && (
        <div className="flex justify-center pb-6">
          <button
            id="fav-pill-trigger"
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-stone-900 hover:bg-stone-800 text-stone-100 px-6 py-3.5 rounded-none shadow-2xl border border-stone-800 transition-all duration-300 hover:scale-105"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-100"></span>
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 h-4 text-stone-400"
            >
              <path d="M11.645 20.91l-.007-.003-.008-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.250 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.008.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-xs uppercase font-sans tracking-[0.2em] font-medium">
              Đã Chọn: {favoriteIds.length} Ảnh Yêu Thích
            </span>
          </button>
        </div>
      )}

      {/* Expanded Modal Box */}
      {isOpen && (
        <div className="bg-stone-950 border-t border-stone-900 shadow-2xl transition-all duration-500 max-h-[85vh] overflow-y-auto block mb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-stone-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5 h-5 text-stone-200 animate-pulse"
                >
                  <path d="M11.645 20.91l-.007-.003-.008-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.250 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.008.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
                <h3 className="font-serif text-lg tracking-wider text-stone-100 uppercase italic">
                  Danh Sách Ảnh Yêu Thích Của Bạn
                </h3>
                <span className="text-xs bg-stone-900/60 text-stone-300 px-2.5 py-0.5 border border-stone-850 font-mono rounded-none">
                  {favoritePhotos.length} ảnh
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  id="drawer-clear-btn"
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-sans uppercase tracking-widest text-stone-500 hover:text-stone-300 transition-colors"
                >
                  Xóa tất cả
                </button>
                <button
                  id="drawer-close-btn"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-stone-400 hover:text-stone-100 p-2 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Grid Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Photo list (Left Side) */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {favoritePhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="relative group aspect-square bg-stone-900 border border-stone-850 rounded-none overflow-hidden"
                    >
                      <img
                        src={photo.url}
                        alt="Favorite item"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        id={`remove-fav-btn-${photo.id}`}
                        type="button"
                        onClick={() => onRemoveFavorite(photo.id)}
                        className="absolute top-1 right-1 bg-stone-950/80 hover:bg-stone-100 hover:text-stone-950 text-white p-1 rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300"
                        title="Xóa khỏi yêu thích"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-1 left-1 bg-stone-950/80 px-1 py-0.5 rounded-none border border-stone-850/60 font-mono text-[8px] text-stone-400">
                        {photo.id}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-500 mt-3 font-light leading-relaxed">
                  (*) Nhấn vào nút hình trái tim trên ảnh ở thư viện để tiếp tục thêm hoặc bớt ảnh khỏi bộ chọn.
                </p>
              </div>

              {/* Submission Form (Right Side) */}
              <div className="bg-stone-900/30 p-5 rounded-none border border-stone-900">
                {isSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-none bg-stone-100/10 border border-stone-300/30 flex items-center justify-center text-stone-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-serif text-stone-100 text-md uppercase tracking-wider italic">Gửi Thành Công!</h4>
                      <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                        Studio đã nhận được danh sách ảnh yêu thích của bạn ({favoritePhotos.length} ảnh). Chúng tôi sẽ tiến hành xử lý/chỉnh sửa ngay!
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] text-stone-300 font-medium pb-2 border-b border-stone-900">
                      Gửi Lựa Chọn Cho Studio
                    </h4>

                    <div className="space-y-1">
                      <label htmlFor="fav-client-name" className="block text-[10px] uppercase tracking-wider text-stone-400">
                        Tên khách hàng *
                      </label>
                      <input
                        id="fav-client-name"
                        type="text"
                        required
                        placeholder="Ví dụ: Thảo & Minh"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 rounded-none px-3 py-2 text-xs text-stone-100 placeholder-stone-700 focus:outline-none focus:border-stone-150 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="fav-client-phone" className="block text-[10px] uppercase tracking-wider text-stone-400">
                        Số điện thoại / Zalo
                      </label>
                      <input
                        id="fav-client-phone"
                        type="text"
                        placeholder="Ví dụ: 0945xxxxxx"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 rounded-none px-3 py-2 text-xs text-stone-100 placeholder-stone-700 focus:outline-none focus:border-stone-150 transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="fav-client-notes" className="block text-[10px] uppercase tracking-wider text-stone-400">
                        Ghi chú yêu cầu chỉnh sửa
                      </label>
                      <textarea
                        id="fav-client-notes"
                        rows={2}
                        placeholder="Ví dụ: Tấm pw-2 bóp mặt nhẹ, ae-5 in khổ lớn cổng chào..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-850 rounded-none px-3 py-2 text-xs text-stone-100 placeholder-stone-700 focus:outline-none focus:border-stone-150 transition-colors resize-none"
                      />
                    </div>

                    <button
                      id="submit-favorites-list"
                      type="submit"
                      disabled={isSubmitting || favoritePhotos.length === 0}
                      className="w-full bg-stone-100 hover:bg-stone-250 text-stone-950 font-semibold uppercase text-xs tracking-widest py-2.5 rounded-none transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-stone-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        'Gửi yêu cầu chỉnh sửa'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
