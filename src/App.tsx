import React, { useState, useEffect } from 'react';
import { Album, FavoriteList, StudioSettings } from './types';
import { INITIAL_ALBUMS } from './mockData';

// Sub-components
import StudioHeader from './components/StudioHeader';
import StudioFooter from './components/StudioFooter';
import AlbumCard from './components/AlbumCard';
import PasswordGate from './components/PasswordGate';
import MasonryGrid from './components/MasonryGrid';
import ImageViewer from './components/ImageViewer';
import FavoritesDrawer from './components/FavoritesDrawer';
import AdminPanel from './components/AdminPanel';

// Client-side image compression helper to avoid localStorage quota limits and auto-detect layout
export function compressImage(
  base64Url: string, 
  maxWidth = 1400, 
  maxHeight = 1400, 
  quality = 0.75
): Promise<{ url: string; aspect: 'landscape' | 'portrait' }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      const aspect: 'landscape' | 'portrait' = width >= height ? 'landscape' : 'portrait';

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const url = canvas.toDataURL('image/jpeg', quality);
        resolve({ url, aspect });
      } else {
        resolve({ url: base64Url, aspect });
      }
    };
    img.onerror = () => {
      resolve({ url: base64Url, aspect: 'landscape' });
    };
  });
}

export default function App() {
  // State 0: Custom Studio configurations (Persisted in localStorage)
  const [studioSettings, setStudioSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('thanhthao_studio_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.brandName) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return {
      brandName: 'PHƯƠNG TINA BRIDAL',
      brandSubtitle: 'Phòng Trưng Bày Ảnh Cưới Nghệ Thuật',
      brandSlogan: '"nơi thời gian ngừng trôi, trọn vẹn từng thệ ước"',
      aboutTitle: 'VỀ PHƯƠNG TINA BRIDAL GALLERY',
      aboutText: 'Chúng tôi hiểu rằng mỗi đám cưới là sự kết tinh của cuộc hành trình tình yêu ngọt ngào nhất. Với phong cách tối giản cao cấp mang hơi hướng điện ảnh cổ điển, chúng tôi ghi dấu những cái ôm khẽ khàng, nụ cười hạnh phúc rạng rỡ và những khoảnh khắc thốt lên thệ ước, mang đến trải nghiệm ngắm nhìn sang trọng bậc nhất dành riêng cho các cặp đôi.',
      hotline: '0976.277.463 - 0839.855.888',
      email: 'hello@phuongtinastudio.vn',
      address: '18 - Dh2 - Kp7 - P. Chánh Phú Hoà ( Bến Cát - Bình Dương ) - TP. Hồ Chí Minh',
      heroImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1800',
      logoText: 'Phương Tina',
      logoSubtitle: 'Bridal & Editorial Gallery',
    };
  });

  // State 1: Primary active collections (Persisted in localStorage)
  const [albums, setAlbums] = useState<Album[]>(() => {
    try {
      const saved = localStorage.getItem('thanhthao_albums');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return INITIAL_ALBUMS;
    } catch (e) {
      return INITIAL_ALBUMS;
    }
  });

  // State 2: Customer submitted selections (Persisted in localStorage)
  const [favoritesSubmissions, setFavoritesSubmissions] = useState<FavoriteList[]>(() => {
    try {
      const saved = localStorage.getItem('thanhthao_favorites_submissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // State 3: Active views routing triggers
  const [activePage, setActivePage] = useState<'home' | 'albums' | 'admin' | 'album-detail'>('home');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  // State 4: Security gates keys
  const [unlockedAlbumIds, setUnlockedAlbumIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem('thanhthao_unlocked_albums');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  });

  // State 5: Active clients workspace heart-favorites selection keyed by albumId
  const [favoritesList, setFavoritesList] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('thanhthao_client_favorites_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
      return {};
    } catch (e) {
      return {};
    }
  });

  // State 6: Photo Viewer deep overlay
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // State 7: Custom Watermarks preferences
  const [showWatermarks, setShowWatermarks] = useState(true);
  const [watermarkText, setWatermarkText] = useState(() => studioSettings?.brandName || 'PHƯƠNG TINA BRIDAL');

  // State 8: Copy feedback
  const [copiedAlbum, setCopiedAlbum] = useState(false);

  // Admin Mode client state for direct posting and deleting inside album details
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('thanhthao_admin_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isInlineAdminOpen, setIsInlineAdminOpen] = useState(true);
  const [adminInputPassword, setAdminInputPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = studioSettings?.adminPassword || '1234';
    if (adminInputPassword === correctPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('thanhthao_admin_logged_in', 'true');
      setAdminLoginError('');
      setAdminInputPassword('');
    } else {
      setAdminLoginError('Mật khẩu quản trị viên không chính xác. Vui lòng thử lại!');
    }
  };

  const handleAdminLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất quyền quản trị?')) {
      setIsAdminLoggedIn(false);
      sessionStorage.removeItem('thanhthao_admin_logged_in');
      handleNavigate('home');
    }
  };
  const [isInlineUploading, setIsInlineUploading] = useState(false);
  const [inlinePhotoUrl, setInlinePhotoUrl] = useState('');
  const [inlinePhotoTitle, setInlinePhotoTitle] = useState('');

  const handleInlineUpload = (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsInlineUploading(true);
    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const loadedImages = [...targetAlbum.images];
    let processedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result.toString();
          try {
            const compressed = await compressImage(base64Url);
            loadedImages.push({
              id: `img-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
              url: compressed.url,
              title: file.name.replace(/\.[^/.]+$/, ""),
              aspect: compressed.aspect
            });
          } catch (err) {
            loadedImages.push({
              id: `img-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
              url: base64Url,
              title: file.name.replace(/\.[^/.]+$/, ""),
              aspect: 'landscape'
            });
          }
        }
        
        processedCount++;
        if (processedCount === files.length) {
          const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, images: loadedImages } : a);
          setAlbums(updatedAlbums);
          setIsInlineUploading(false);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleInlineAddCustomPhoto = (albumId: string) => {
    if (!inlinePhotoUrl.trim()) return;

    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const newPhoto = {
      id: `img-${Date.now()}`,
      url: inlinePhotoUrl,
      title: inlinePhotoTitle || 'Khoảnh khắc ngày chung đôi',
      aspect: 'landscape' as const
    };

    const updatedAlbum = {
      ...targetAlbum,
      images: [...targetAlbum.images, newPhoto]
    };

    setAlbums(albums.map(a => a.id === albumId ? updatedAlbum : a));
    setInlinePhotoUrl('');
    setInlinePhotoTitle('');
  };

  const handleInlineRemovePhoto = (albumId: string, photoId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá ảnh này khỏi album?')) return;
    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const updatedAlbum = {
      ...targetAlbum,
      images: targetAlbum.images.filter(p => p.id !== photoId)
    };

    setAlbums(albums.map(a => a.id === albumId ? updatedAlbum : a));
  };

  const handleInlineSetCover = (albumId: string, photoUrl: string) => {
    const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, coverUrl: photoUrl } : a);
    setAlbums(updatedAlbums);
  };

  const handleInlineUploadCoverFile = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result.toString();
          const compressed = await compressImage(base64Url);
          const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, coverUrl: compressed.url } : a);
          setAlbums(updatedAlbums);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInlineClearCover = (albumId: string) => {
    const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, coverUrl: '' } : a);
    setAlbums(updatedAlbums);
  };

  // Save changes to settings
  useEffect(() => {
    try {
      localStorage.setItem('thanhthao_studio_settings', JSON.stringify(studioSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
    if (studioSettings?.brandName) {
      setWatermarkText(studioSettings.brandName);
    }
  }, [studioSettings]);

  // Trigger state persistence with fail-safety
  useEffect(() => {
    try {
      localStorage.setItem('thanhthao_albums', JSON.stringify(albums));
    } catch (e) {
      console.error('Failed to save albums to localStorage:', e);
      alert('Không thể lưu album mới vì dung lượng trình duyệt quá giới hạn (tối đa 5MB). Vui lòng xóa bớt một số ảnh lớn hoặc nén ảnh nhỏ hơn!');
    }
  }, [albums]);

  useEffect(() => {
    try {
      localStorage.setItem('thanhthao_favorites_submissions', JSON.stringify(favoritesSubmissions));
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  }, [favoritesSubmissions]);

  useEffect(() => {
    try {
      localStorage.setItem('thanhthao_client_favorites_list', JSON.stringify(favoritesList));
    } catch (e) {
      console.error('Failed to save favorites list:', e);
    }
  }, [favoritesList]);

  useEffect(() => {
    try {
      sessionStorage.setItem('thanhthao_unlocked_albums', JSON.stringify(unlockedAlbumIds));
    } catch (e) {
      console.error('Failed to save unlocked albums:', e);
    }
  }, [unlockedAlbumIds]);

  // Reactive URL Routing Mechanism (Supports ?album={slug} & ?page=admin etc)
  useEffect(() => {
    const parseUrlParameters = () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page');
      const albumSlug = params.get('album');
      const photoId = params.get('photo');

      if (albumSlug) {
        // Direct View Album
        const targetAlb = albums.find(a => a.id === albumSlug);
        if (targetAlb) {
          setActivePage('album-detail');
          setActiveAlbumId(targetAlb.id);

          // Deep image index lookup
          if (photoId) {
            const index = targetAlb.images.findIndex(p => p.id === photoId);
            if (index !== -1) {
              setActivePhotoIndex(index);
            }
          } else {
            setActivePhotoIndex(null);
          }
        } else {
          // Fallback if album doesn't exist
          setActivePage('home');
          setActiveAlbumId(null);
        }
      } else if (page === 'admin') {
        setActivePage('admin');
        setActiveAlbumId(null);
      } else if (page === 'albums') {
        setActivePage('albums');
        setActiveAlbumId(null);
      } else {
        setActivePage('home');
        setActiveAlbumId(null);
      }
    };

    // Parse once on mount
    parseUrlParameters();

    // Listen to popstate changes
    window.addEventListener('popstate', parseUrlParameters);
    return () => window.removeEventListener('popstate', parseUrlParameters);
  }, [albums]);

  // Route Link Modifier Helper
  const handleNavigate = (page: string, targetAlbumId?: string) => {
    let newUrl = window.location.pathname;
    
    if (page === 'album-detail' && targetAlbumId) {
      newUrl += `?album=${targetAlbumId}`;
      setActivePage('album-detail');
      setActiveAlbumId(targetAlbumId);
    } else if (page === 'admin') {
      newUrl += '?page=admin';
      setActivePage('admin');
      setActiveAlbumId(null);
    } else if (page === 'albums') {
      newUrl += '?page=albums';
      setActivePage('albums');
      setActiveAlbumId(null);
    } else {
      newUrl = window.location.pathname; // Clear query strings
      setActivePage('home');
      setActiveAlbumId(null);
    }

    window.history.pushState(null, '', newUrl);
    // Smooth scroll page back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Heart Favorite Toggler
  const handleToggleFavorite = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering full-viewer click
    if (!activeAlbumId) return;

    const currentList = favoritesList[activeAlbumId] || [];
    let updatedList: string[];

    if (currentList.includes(photoId)) {
      updatedList = currentList.filter(id => id !== photoId);
    } else {
      updatedList = [...currentList, photoId];
    }

    setFavoritesList({
      ...favoritesList,
      [activeAlbumId]: updatedList
    });
  };

  const handleRemoveFavoriteItemByHand = (photoId: string) => {
    if (!activeAlbumId) return;
    const currentList = favoritesList[activeAlbumId] || [];
    const updatedList = currentList.filter(id => id !== photoId);
    setFavoritesList({
      ...favoritesList,
      [activeAlbumId]: updatedList
    });
  };

  const handleClearAllFavorites = () => {
    if (!activeAlbumId) return;
    setFavoritesList({
      ...favoritesList,
      [activeAlbumId]: []
    });
  };

  // Submission favorites package from client
  const handleSubmitClientFavorites = (name: string, phone: string, notes: string) => {
    if (!activeAlbumId) return;
    
    const clientSelection: FavoriteList = {
      clientName: name,
      clientPhone: phone,
      albumId: activeAlbumId,
      photoIds: favoritesList[activeAlbumId] || [],
      notes: notes,
      submittedAt: new Date().toISOString()
    };

    setFavoritesSubmissions([clientSelection, ...favoritesSubmissions]);
    
    // Smoothly clean client selections once successfully dispatched!
    setTimeout(() => {
      setFavoritesList({
        ...favoritesList,
        [activeAlbumId]: []
      });
    }, 1500);
  };

  // Photo viewer modal trigger index changes
  const handlePhotoViewerNavigate = (index: number) => {
    setActivePhotoIndex(index);
    if (activeAlbumId) {
      const activeAlbumItem = albums.find(a => a.id === activeAlbumId);
      if (activeAlbumItem && activeAlbumItem.images[index]) {
        const photoObj = activeAlbumItem.images[index];
        const newUrl = `${window.location.pathname}?album=${activeAlbumId}&photo=${photoObj.id}`;
        window.history.replaceState(null, '', newUrl); // keeps history clean
      }
    }
  };

  const handleClosePhotoViewer = () => {
    setActivePhotoIndex(null);
    if (activeAlbumId) {
      const newUrl = `${window.location.pathname}?album=${activeAlbumId}`;
      window.history.replaceState(null, '', newUrl); // clean deep photo hash
    }
  };

  // Unlock password-protected album
  const handleUnlockAlbum = (enteredPass: string): boolean => {
    if (!activeAlbumId) return false;
    const currentAlbum = albums.find(a => a.id === activeAlbumId);
    
    if (currentAlbum && currentAlbum.password === enteredPass) {
      setUnlockedAlbumIds([...unlockedAlbumIds, activeAlbumId]);
      return true;
    }
    return false;
  };

  // Safe search of active details
  const currentAlbum = albums.find(a => a.id === activeAlbumId);
  const isCurrentProtected = currentAlbum && !!currentAlbum.password;
  const isCurrentUnlocked = activeAlbumId && unlockedAlbumIds.includes(activeAlbumId);
  const currentCover = currentAlbum
    ? (currentAlbum.coverUrl || (currentAlbum.images && currentAlbum.images[0]?.url) || '')
    : '';

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-200">
      {/* Studio Header block navigation */}
      <StudioHeader currentPage={activePage} onNavigate={handleNavigate} studioSettings={studioSettings} />

      {/* Primary views switcher */}
      <main className="flex-1 w-full mx-auto">
        {/* VIEW 1: HOME PAGE */}
        {activePage === 'home' && (
          <div className="space-y-20 animate-fade-in">
            {/* Scenic Hero Welcome Slideshow Slider section */}
            <section className="relative w-full h-[70vh] sm:h-[85vh] flex items-center justify-center overflow-hidden uppercase font-serif">
              <div className="absolute inset-0 z-0">
                {studioSettings.heroImageUrl ? (
                  <img
                    src={studioSettings.heroImageUrl}
                    alt={`${studioSettings.brandName} Cover Hero`}
                    className="w-full h-full object-cover scale-[1.01] filter grayscale-[40%] contrast-[1.08] opacity-80"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-900 border-b border-stone-850 flex items-center justify-center">
                    <span className="text-xs text-stone-600 font-sans tracking-widest uppercase">Trống ảnh nền Banner chính</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/60" />
              </div>

              {/* Centered logo-branding text */}
              <div className="relative z-10 text-center max-w-4xl px-4 space-y-6">
                <span className="text-xs uppercase tracking-[0.5em] text-stone-300 font-sans font-light">
                  {studioSettings.brandSubtitle}
                </span>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-[0.25em] text-stone-100 leading-tight uppercase font-medium">
                  {studioSettings.brandName}
                </h1>
                <div className="h-[1px] w-24 bg-stone-550 mx-auto" />
                <p className="text-sm sm:text-lg tracking-widest font-sans font-light text-stone-300 lowercase italic capitalize">
                  {studioSettings.brandSlogan}
                </p>
                <button
                  id="hero-albums-btn"
                  type="button"
                  onClick={() => handleNavigate('albums')}
                  className="mt-6 inline-flex border border-stone-800 text-stone-200 font-sans text-xs tracking-widest uppercase bg-stone-900/60 hover:bg-stone-100 hover:text-stone-950 hover:border-stone-100 px-8 py-3.5 transition-all duration-300 rounded-none cursor-pointer"
                >
                  Khám phá các Album
                </button>
              </div>

              {/* Decorative side indicators */}
              <div className="absolute bottom-8 left-8 text-stone-600 font-mono text-[9px] tracking-[0.25em] uppercase hidden lg:block">
                {studioSettings.brandName} CO. • EST 2026
              </div>
              <div className="absolute bottom-8 right-8 text-stone-600 font-mono text-[9px] tracking-[0.25em] uppercase hidden lg:block">
                FINE-ART BRIDAL GALLERY PLATFORM
              </div>
            </section>

            {/* Intro paragraph section */}
            <section className="max-w-4xl mx-auto px-4 text-center space-y-6 py-10">
              <h2 className="font-serif text-3xl font-light tracking-[0.18em] text-stone-100 uppercase italic">
                {studioSettings.aboutTitle}
              </h2>
              <div className="h-[1px] w-12 bg-stone-900 mx-auto" />
              <p className="text-sm text-stone-400 font-light leading-relaxed font-sans max-w-2xl mx-auto">
                {studioSettings.aboutText}
              </p>
            </section>

            {/* Recent Albums section layout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <div className="flex items-end justify-between border-b border-stone-900 pb-4">
                <div>
                  <h2 className="font-serif text-2xl tracking-[0.15em] text-stone-100 uppercase font-light italic">
                    Danh Sách Album Bàn Giao
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Nhập mã bảo vệ được gửi riêng cho các khách hàng bảo mật.
                  </p>
                </div>
                <button
                  id="view-all-bottom-btn"
                  type="button"
                  onClick={() => handleNavigate('albums')}
                  className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-100 transition-colors"
                >
                  Xem tất cả
                </button>
              </div>

              {/* Albums preview block lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.slice(0, 3).map((alb) => (
                  <AlbumCard
                     key={alb.id}
                     album={alb}
                     onOpen={(id) => handleNavigate('album-detail', id)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
        {activePage === 'albums' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in">
            <div>
              <h2 className="font-serif text-3xl font-light tracking-[0.18em] text-stone-100 uppercase italic">
                Bộ Sưu Tập Album
              </h2>
              <p className="text-xs text-stone-500 font-sans mt-2">
                Nơi lưu trữ những thệ ước trăm năm của {studioSettings.brandName}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((alb) => (
                <AlbumCard
                  key={alb.id}
                  album={alb}
                  onOpen={(id) => handleNavigate('album-detail', id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ALBUM CUSTOMER DETAIL VIEW */}
        {activePage === 'album-detail' && currentAlbum && (
          <div className="animate-fade-in">
            {/* If protected by password AND not unlocked yet, we show password gate */}
            {isCurrentProtected && !isCurrentUnlocked ? (
              <PasswordGate
                albumTitle={currentAlbum.title}
                albumCover={currentCover || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200'}
                onUnlock={handleUnlockAlbum}
                onBack={() => handleNavigate('home')}
              />
            ) : (
              // ACTUAL UNLOCKED / PUBLIC ALBUM VIEWER SCREEN
              <div className="space-y-12 pb-24">
                {/* Visual Cover Header element */}
                <div className="relative w-full h-[55vh] sm:h-[70vh] flex items-end justify-center uppercase overflow-hidden">
                  <div className="absolute inset-0 z-0 bg-stone-950 flex items-center justify-center">
                    {currentCover ? (
                      <img
                        src={currentCover}
                        alt={currentAlbum.title}
                        className="w-full h-full object-cover grayscale-[30%] opacity-80 scale-[1.01]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                        <span className="font-serif text-3xl text-stone-500 italic uppercase tracking-widest leading-none">
                          {studioSettings.brandName}
                        </span>
                        <span className="text-[10px] text-stone-605 font-mono tracking-[0.25em] mt-3 uppercase">
                          SẴN SÀNG NHẬN ẢNH BÀN GIAO
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/15" />
                  </div>

                  {/* Centered text and metadata layout */}
                  <div className="relative z-10 text-center max-w-4xl px-4 py-12 space-y-4">
                    <span className="font-mono text-xs text-stone-300 tracking-[0.25em]">
                      📅 {currentAlbum.date} — {currentAlbum.location}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-extralight tracking-[0.15em] text-stone-100 font-serif italic">
                      {currentAlbum.title}
                    </h2>
                    <p className="text-[10px] uppercase text-stone-400 font-sans tracking-[0.3em] font-light">
                      Chạm vào một bức ảnh để xem phóng to chi tiết
                    </p>
                  </div>
                </div>

                {/* Sub-gallery description block */}
                <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
                  <p className="text-sm font-light leading-relaxed text-stone-400 max-w-2xl mx-auto">
                    {currentAlbum.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans uppercase tracking-[0.18em] pt-4">
                    {/* Share whole album link */}
                    <button
                      id="share-album-link-btn"
                      type="button"
                      onClick={() => {
                        const albumUrl = `${window.location.origin}${window.location.pathname}?album=${currentAlbum.id}`;
                        navigator.clipboard.writeText(albumUrl).then(() => {
                          setCopiedAlbum(true);
                          setTimeout(() => setCopiedAlbum(false), 2500);
                        });
                      }}
                      className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white px-4 py-2.5 rounded-none transition-all font-light cursor-pointer"
                    >
                      {copiedAlbum ? '✓ Đã sao chép link' : '🔗 Chia sẻ link album'}
                    </button>

                    {/* Slideshow play trigger */}
                    <button
                      id="slide-album-start-btn"
                      type="button"
                      onClick={() => handlePhotoViewerNavigate(0)}
                      className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-250 text-stone-950 px-4 py-2.5 rounded-none transition-all font-medium cursor-pointer"
                    >
                      ▶ Xem Slideshow tự động
                    </button>

                    {/* Watermark global toggler */}
                    <div className="inline-flex items-center gap-3 bg-stone-900/60 border border-stone-850 px-4 py-2.5 rounded-none text-stone-400 text-xs">
                      <label htmlFor="watermark-toggle" className="cursor-pointer select-none">Bản quyền dạng mờ:</label>
                      <input
                        id="watermark-toggle"
                        type="checkbox"
                        checked={showWatermarks}
                        onChange={(e) => setShowWatermarks(e.target.checked)}
                        className="w-3.5 h-3.5 accent-stone-100 rounded-none border-stone-800 focus:outline-none cursor-pointer"
                      />
                    </div>

                    {/* Direct Admin Control toggle */}
                    {isAdminLoggedIn && (
                      <button
                        type="button"
                        onClick={() => setIsInlineAdminOpen(!isInlineAdminOpen)}
                        className={`inline-flex items-center gap-2 border px-4 py-2.5 rounded-none text-xs uppercase tracking-widest font-sans transition-all duration-300 cursor-pointer ${
                          isInlineAdminOpen 
                            ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-stone-950 font-semibold shadow-lg' 
                            : 'bg-stone-900/65 hover:bg-stone-850 border-stone-800 text-stone-300 hover:text-white'
                        }`}
                      >
                        {isInlineAdminOpen ? '🔒 Đóng Bảng Quản Trị' : '⚡ Đăng ảnh / Xóa ảnh'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Direct Inline Admin Upload Panel */}
                {isAdminLoggedIn && isInlineAdminOpen && (
                  <div className="max-w-4xl mx-auto px-4 py-6 bg-stone-900/40 border border-stone-900 space-y-6 animate-fade-in text-left">
                    <div className="border-b border-stone-850 pb-3">
                      <h3 className="font-serif text-lg text-stone-100 font-light italic flex items-center gap-2">
                        <span>⚡</span> Bảng Quản Trị Nhanh (Trực tiếp trong Album)
                      </h3>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 mt-1">
                        QUYỀN HẠN: ĐĂNG ẢNH MỚI, XOÁ ẢNH CŨ VÀ ĐẶT/XUẤT ẢNH BÌA TRỰC TIẾP TRANG CHỦ
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Column 1: Drag and drop selection upload */}
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium">1. Chọn & tải tệp ảnh từ thiết bị</label>
                        <div className="relative border border-dashed border-stone-800 hover:border-stone-500 rounded-none h-28 flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleInlineUpload(e, currentAlbum.id)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isInlineUploading}
                          />
                          {isInlineUploading ? (
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <svg className="animate-spin h-5 w-5 text-stone-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-xs text-stone-400 font-mono">Đang tải ảnh...</span>
                            </div>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 25" strokeWidth={1} stroke="currentColor" className="w-6 h-6 text-stone-550 group-hover:text-stone-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                              </svg>
                              <span className="text-[10px] text-stone-400 text-center mt-2 group-hover:text-stone-200">
                                Đăng thêm ảnh vào Album (JPG, PNG...)
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Add photo from URL */}
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-stone-400 font-medium font-sans">2. Hoặc thêm nhanh từ liên kết URL</label>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            placeholder="Dán liên kết ảnh https://..."
                            value={inlinePhotoUrl}
                            onChange={(e) => setInlinePhotoUrl(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 px-3 py-1 text-xs text-stone-100 placeholder-stone-850 focus:outline-none focus:border-stone-500"
                          />
                          <input
                            type="text"
                            placeholder="Chú thích ảnh"
                            value={inlinePhotoTitle}
                            onChange={(e) => setInlinePhotoTitle(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 px-3 py-1 text-xs text-stone-100 placeholder-stone-850 focus:outline-none focus:border-stone-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleInlineAddCustomPhoto(currentAlbum.id)}
                            className="w-full py-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-600 font-sans text-xs uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            Đăng từ URL Link
                          </button>
                        </div>
                      </div>

                      {/* Column 3: Custom Cover image manager */}
                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider text-amber-500 font-medium">3. Sửa / Xóa ảnh bìa Album</label>
                        <div className="p-3 bg-stone-950 border border-stone-850 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center shrink-0">
                              {currentCover ? (
                                <img src={currentCover} alt="" className="w-full h-full object-cover opacity-80" />
                              ) : (
                                <span className="text-[8px] font-mono text-stone-600">Trống</span>
                              )}
                            </div>
                            <div className="text-[10px] text-stone-400 leading-tight">
                              {currentAlbum.coverUrl ? 'Đang dùng bìa riêng cấu hình sẵn.' : 'Đang tự lấy ảnh đầu làm bìa.'}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <div className="relative flex-1 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-300 text-center text-[10px] font-light tracking-wide uppercase transition-all duration-350 cursor-pointer border border-stone-800">
                              <span>Tải bìa mới</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleInlineUploadCoverFile(e, currentAlbum.id)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                            {currentAlbum.coverUrl && (
                              <button
                                type="button"
                                onClick={() => handleInlineClearCover(currentAlbum.id)}
                                className="px-2.5 bg-rose-950/30 hover:bg-rose-900 text-rose-450 hover:text-white transition-colors text-[9px] uppercase tracking-wider cursor-pointer border border-rose-900/60 font-mono"
                              >
                                Xóa bìa
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Client grid of photos using true Masonry Grid! */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  {currentAlbum.images.length === 0 ? (
                    <div className="text-center py-20 text-neutral-500 text-xs font-light italic">
                      Album này hiện đang được tải ảnh lên. Quý khách vui lòng chờ trong giây lát...
                    </div>
                  ) : (
                    <MasonryGrid
                      photos={currentAlbum.images}
                      favorites={favoritesList[currentAlbum.id] || []}
                      onToggleFavorite={handleToggleFavorite}
                      onPhotoClick={(index) => handlePhotoViewerNavigate(index)}
                      showWatermark={showWatermarks}
                      watermarkText={watermarkText}
                      isAdminMode={isAdminLoggedIn && isInlineAdminOpen}
                      onDeletePhoto={(photoId) => handleInlineRemovePhoto(currentAlbum.id, photoId)}
                      onSetCover={(photoUrl) => handleInlineSetCover(currentAlbum.id, photoUrl)}
                      coverUrl={currentAlbum.coverUrl}
                    />
                  )}
                </div>

                {/* Favorites selections Drawer panel at the bottom */}
                <FavoritesDrawer
                  favoriteIds={favoritesList[currentAlbum.id] || []}
                  photos={currentAlbum.images}
                  albumId={currentAlbum.id}
                  onRemoveFavorite={handleRemoveFavoriteItemByHand}
                  onClearAll={handleClearAllFavorites}
                  onSubmitFavorites={handleSubmitClientFavorites}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ADMIN CONTROLLER DASHBOARD */}
        {activePage === 'admin' && (
          !isAdminLoggedIn ? (
            <div className="max-w-md mx-auto px-6 py-16 text-center space-y-8 animate-fade-in my-10 bg-stone-900/20 border border-stone-900">
              <div className="space-y-3">
                <span className="text-[10px] tracking-[0.25em] text-amber-500/80 font-mono uppercase">
                  HỆ THỐNG QUẢN TRỊ BẢO MẬT
                </span>
                <h2 className="font-serif text-3xl font-light tracking-[0.1em] text-stone-100 uppercase italic">
                  Đăng Nhập Admin
                </h2>
                <div className="h-[1px] w-12 bg-amber-500/30 mx-auto mt-2" />
              </div>

              <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm mx-auto">
                Vui lòng điền mật khẩu quản trị viên được cấu hình riêng để truy cập bảng điểu khiển, chỉnh sửa giao diện và danh mục album.
              </p>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={adminInputPassword}
                    onChange={(e) => {
                      setAdminInputPassword(e.target.value);
                      if (adminLoginError) setAdminLoginError('');
                    }}
                    placeholder="MẬT KHẨU QUẢN TRỊ VIÊN"
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-3 text-center text-sm font-mono tracking-widest text-stone-100 placeholder-stone-700 focus:outline-none focus:border-amber-500/80 transition-colors"
                  />
                </div>

                {adminLoginError && (
                  <p className="text-[11px] text-rose-500 font-sans tracking-wide">
                    ⚠️ {adminLoginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-950 font-sans text-xs tracking-[0.2em] uppercase font-bold py-3.5 transition-colors cursor-pointer"
                >
                  XÁC THỰC QUYỀN HẠN
                </button>
              </form>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="text-[10px] font-sans uppercase tracking-[0.15em] text-stone-500 hover:text-stone-300 transition-colors"
                >
                  ← QUAY LẠI TRANG CHỦ
                </button>
              </div>
            </div>
          ) : (
            <AdminPanel
              albums={albums}
              favorites={favoritesSubmissions}
              onSaveAlbums={(updated) => setAlbums(updated)}
              onClearFavorites={(index) => setFavoritesSubmissions(favoritesSubmissions.filter((_, i) => i !== index))}
              studioSettings={studioSettings}
              onSaveSettings={setStudioSettings}
              onLogout={handleAdminLogout}
            />
          )
        )}
      </main>

      {/* Fullscreen Photo Lightbox Slider */}
      {activePhotoIndex !== null && currentAlbum && (
        <ImageViewer
          photos={currentAlbum.images}
          currentIndex={activePhotoIndex}
          onClose={handleClosePhotoViewer}
          onNavigate={handlePhotoViewerNavigate}
          showWatermark={showWatermarks}
          watermarkText={watermarkText}
          albumSlug={currentAlbum.id}
        />
      )}

      {/* Studio elegant footer block */}
      <StudioFooter onNavigate={handleNavigate} studioSettings={studioSettings} />
    </div>
  );
}
