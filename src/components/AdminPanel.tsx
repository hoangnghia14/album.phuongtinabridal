import React, { useState } from 'react';
import { Album, Photo, FavoriteList, StudioSettings } from '../types';
import { compressImage } from '../App';

interface AdminPanelProps {
  albums: Album[];
  favorites: FavoriteList[];
  onSaveAlbums: (updated: Album[]) => void;
  onClearFavorites: (index: number) => void;
  studioSettings?: StudioSettings;
  onSaveSettings?: (updated: StudioSettings) => void;
  onLogout?: () => void;
}

export default function AdminPanel({
  albums,
  favorites,
  onSaveAlbums,
  onClearFavorites,
  studioSettings,
  onSaveSettings,
  onLogout,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'albums' | 'favorites' | 'deploy' | 'settings'>('albums');
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);

  // Form states for general studio branding settings
  const [settingsBrandName, setSettingsBrandName] = useState(studioSettings?.brandName || 'PHƯƠNG TINA BRIDAL');
  const [settingsBrandSubtitle, setSettingsBrandSubtitle] = useState(studioSettings?.brandSubtitle || 'Phòng Trưng Bày Ảnh Cưới Nghệ Thuật');
  const [settingsBrandSlogan, setSettingsBrandSlogan] = useState(studioSettings?.brandSlogan || '"nơi thời gian ngừng trôi, trọn vẹn từng thệ ước"');
  const [settingsAboutTitle, setSettingsAboutTitle] = useState(studioSettings?.aboutTitle || 'VỀ PHƯƠNG TINA BRIDAL GALLERY');
  const [settingsAboutText, setSettingsAboutText] = useState(studioSettings?.aboutText || 'Chúng tôi hiểu rằng mỗi đám cưới là sự kết tinh của cuộc hành trình tình yêu ngọt ngào nhất. Với phong cách tối giản cao cấp mang hơi hướng điện ảnh cổ điển, chúng tôi ghi dấu những cái ôm khẽ khàng, nụ cười hạnh phúc rạng rỡ và những khoảnh khắc thốt lên thệ ước, mang đến trải nghiệm ngắm nhìn sang trọng bậc nhất dành riêng cho các cặp đôi.');
  const [settingsHotline, setSettingsHotline] = useState(studioSettings?.hotline || '0976.277.463 - 0839.855.888');
  const [settingsEmail, setSettingsEmail] = useState(studioSettings?.email || 'hello@phuongtinastudio.vn');
  const [settingsAddress, setSettingsAddress] = useState(studioSettings?.address || '18 - Dh2 - Kp7 - P. Chánh Phú Hoà ( Bến Cát - Bình Dương ) - TP. Hồ Chí Minh');
  const [settingsHeroImageUrl, setSettingsHeroImageUrl] = useState(studioSettings?.heroImageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1800');
  const [settingsLogoText, setSettingsLogoText] = useState(studioSettings?.logoText || 'Phương Tina');
  const [settingsLogoSubtitle, setSettingsLogoSubtitle] = useState(studioSettings?.logoSubtitle || 'Bridal & Editorial Gallery');
  const [settingsAdminPassword, setSettingsAdminPassword] = useState(studioSettings?.adminPassword || '1234');

  // Form states for creating/editing albums
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumCover, setAlbumCover] = useState('');
  const [albumLocation, setAlbumLocation] = useState('');
  const [albumPassword, setAlbumPassword] = useState('');
  const [albumDate, setAlbumDate] = useState('');
  
  // Custom Photo uploads states inside editing album
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [isUploadingBase64, setIsUploadingBase64] = useState(false);

  // Edit states for currently selected album properties
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCover, setEditCover] = useState('');

  // Synchronize when the user opens an album to edit
  React.useEffect(() => {
    if (editingAlbumId) {
      const target = albums.find(a => a.id === editingAlbumId);
      if (target) {
        setEditTitle(target.title || '');
        setEditDescription(target.description || '');
        setEditLocation(target.location || '');
        setEditDate(target.date || '');
        setEditPassword(target.password || '');
        setEditCover(target.coverUrl || '');
      }
    }
  }, [editingAlbumId, albums]);

  const handleUpdateAlbumProperties = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbumId) return;

    const updated = albums.map(a => {
      if (a.id === editingAlbumId) {
        return {
          ...a,
          title: editTitle,
          description: editDescription,
          location: editLocation,
          date: editDate,
          password: editPassword || undefined,
          coverUrl: editCover
        };
      }
      return a;
    });

    onSaveAlbums(updated);
    triggerToast('Cập nhật thông tin Album thành công!');
  };

  const handleUploadEditCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result.toString();
          const compressed = await compressImage(base64Url);
          setEditCover(compressed.url);
          // Auto sync to albums state
          const updated = albums.map(a => 
            a.id === editingAlbumId ? { ...a, coverUrl: compressed.url } : a
          );
          onSaveAlbums(updated);
          triggerToast('Đã tải và thay đổi ảnh bìa thành công!');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      triggerToast('Lỗi khi nén ảnh bìa!');
    }
  };

  const handleClearEditCover = () => {
    setEditCover('');
    const updated = albums.map(a => 
      a.id === editingAlbumId ? { ...a, coverUrl: '' } : a
    );
    onSaveAlbums(updated);
    triggerToast('Đã xóa ảnh bìa hiện tại.');
  };

  const handleUploadCreateCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result.toString();
          const compressed = await compressImage(base64Url);
          setAlbumCover(compressed.url);
          triggerToast('Đã nén làm ảnh bìa!');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      triggerToast('Lỗi khi nén ảnh bìa!');
    }
  };

  const handleUploadHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Url = event.target.result.toString();
          const compressed = await compressImage(base64Url);
          setSettingsHeroImageUrl(compressed.url);
          triggerToast('Đã tải hình ảnh lên và nén làm ảnh nền Banner chính!');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      triggerToast('Lỗi khi tải hoặc nén ảnh nền!');
    }
  };

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Predefined gorgeous wedding image samples for single-click addition
  const SAMPLE_WEDDING_PHOTOS = [
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', title: 'Romantic Embrace' },
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', title: 'Evening Sun Rays' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800', title: 'Chic Gown Detail' },
    { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800', title: 'Vintage Couple' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800', title: 'Black and White Classic' },
    { url: 'https://images.unsplash.com/photo-1507504038482-76210062ecee?q=80&w=800', title: 'Mountain Sunset' },
  ];

  // Create new album handler
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;

    const slug = albumTitle.toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    const newAlbum: Album = {
      id: slug || `album-${Date.now()}`,
      slug: slug || `album-${Date.now()}`,
      title: albumTitle,
      description: albumDescription || 'Album ảnh cưới cao cấp của Thanh Thảo Studio.',
      coverUrl: albumCover,
      date: albumDate || new Date().toLocaleDateString('vi-VN'),
      location: albumLocation || 'Thanh Thảo Studio',
      password: albumPassword || undefined,
      images: [],
      createdAt: new Date().toISOString()
    };

    onSaveAlbums([newAlbum, ...albums]);
    triggerToast('Tạo album thành công!');

    // Reset controls
    setAlbumTitle('');
    setAlbumDescription('');
    setAlbumCover('');
    setAlbumLocation('');
    setAlbumPassword('');
    setAlbumDate('');
  };

  // Delete album handler
  const handleDeleteAlbum = (id: string) => {
    if (confirm('Bạn chắc chắn muốn xóa album này? Khách hàng sẽ không thể truy cập được nữa.')) {
      onSaveAlbums(albums.filter((a) => a.id !== id));
      if (editingAlbumId === id) setEditingAlbumId(null);
      triggerToast('Đã xóa album.');
    }
  };

  // Base64 file conversion handler (Real client-side upload supporting drag-n-drop or click)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingBase64(true);
    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const loadedImages: Photo[] = [...targetAlbum.images];
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
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              aspect: compressed.aspect
            });
          } catch (err) {
            loadedImages.push({
              id: `img-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
              url: base64Url,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              aspect: 'landscape' // Standard
            });
          }
        }
        
        processedCount++;
        if (processedCount === files.length) {
          // Done processing all files
          const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, images: loadedImages } : a);
          onSaveAlbums(updatedAlbums);
          setIsUploadingBase64(false);
          triggerToast(`Đã upload thành công ${files.length} ảnh lên album!`);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Add individual custom URL photo
  const handleAddCustomPhoto = (e: React.FormEvent, albumId: string) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const newPhoto: Photo = {
      id: `img-${Date.now()}`,
      url: newPhotoUrl,
      title: newPhotoTitle || 'Khoảnh khắc ngày chung đôi',
      aspect: 'landscape'
    };

    const updatedAlbum = {
      ...targetAlbum,
      images: [...targetAlbum.images, newPhoto]
    };

    onSaveAlbums(albums.map(a => a.id === albumId ? updatedAlbum : a));
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    triggerToast('Đã thêm ảnh vào bộ sưu tập!');
  };

  // Add a sample photo directly for testing
  const handleAddSamplePhoto = (sample: { url: string, title: string }, albumId: string) => {
    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const newPhoto: Photo = {
      id: `img-sample-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      url: sample.url,
      title: sample.title,
      aspect: Math.random() > 0.5 ? 'portrait' : 'landscape'
    };

    const updatedAlbum = {
      ...targetAlbum,
      images: [...targetAlbum.images, newPhoto]
    };

    onSaveAlbums(albums.map(a => a.id === albumId ? updatedAlbum : a));
    triggerToast('Thêm ảnh mẫu thành công!');
  };

  // Remove photo from album
  const handleRemovePhoto = (albumId: string, photoId: string) => {
    const targetAlbum = albums.find(a => a.id === albumId);
    if (!targetAlbum) return;

    const updatedAlbum = {
      ...targetAlbum,
      images: targetAlbum.images.filter(p => p.id !== photoId)
    };

    onSaveAlbums(albums.map(a => a.id === albumId ? updatedAlbum : a));
    triggerToast('Đã gỡ ảnh ra khỏi album.');
  };

  // Set cover URL directly
  const handleSetCover = (albumId: string, url: string) => {
    const updatedAlbums = albums.map(a => a.id === albumId ? { ...a, coverUrl: url } : a);
    onSaveAlbums(updatedAlbums);
    triggerToast('Đã thay đổi ảnh bìa đại diện!');
  };

  const editingAlbum = albums.find(a => a.id === editingAlbumId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-all duration-300">
      {/* Toast Notifier */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-stone-100 text-stone-950 text-xs uppercase tracking-widest px-5 py-3 rounded-none shadow-2xl border border-stone-200 transition-all duration-300 animate-slide-in font-medium">
          {toastMessage}
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-stone-900 pb-8 mb-10 gap-6">
        <div>
          <h2 className="font-serif text-3xl font-light tracking-[0.1em] text-stone-100 italic">
            Studio Operator Dashboard
          </h2>
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase mt-1">
            BẢN ĐIỀU HÀNH BÀN GIAO THƯ VIỆN HÌNH ẢNH — {(studioSettings?.brandName || 'PHƯƠNG TINA').toUpperCase()} GALLERY
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap p-0.5 bg-stone-950 border border-stone-900 rounded-none text-xs uppercase tracking-widest font-sans font-medium">
          <button
            id="tab-btn-albums"
            type="button"
            onClick={() => setActiveTab('albums')}
            className={`px-4 py-2.5 rounded-none transition-all duration-300 cursor-pointer ${
              activeTab === 'albums' ? 'bg-stone-900 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Quản Lý Album
          </button>
          
          <button
            id="tab-btn-favorites"
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2.5 rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'favorites' ? 'bg-stone-900 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Khách chọn ảnh ({favorites.length})
          </button>

          <button
            id="tab-btn-settings"
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-none transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings' ? 'bg-stone-900 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            ⚙️ Cấu hình Giao diện
          </button>

          <button
            id="tab-btn-deploy"
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2.5 rounded-none transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'deploy' ? 'bg-stone-900 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            🚀 Hướng dẫn deploy
          </button>

          {onLogout && (
            <button
              id="tab-btn-logout"
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded-none transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-rose-500 hover:text-white hover:bg-rose-950/40 ml-auto font-medium text-[11px] uppercase tracking-wider"
            >
              🔑 Đăng xuất
            </button>
          )}
        </div>
      </div>

      {/* TAB CONTAINER 1: Albums management */}
      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Create new Album Form (Left Side) */}
          <div className="bg-stone-900/40 p-6 sm:p-8 rounded-none border border-stone-900 self-start">
            <h3 className="font-serif text-xl text-stone-100 font-light tracking-wide mb-6 italic">
              Tạo Album Khách Hàng Mới
            </h3>

            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="adm-album-title" className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  Tên Album (Ví dụ: Thảo & Minh Wedding) *
                </label>
                <input
                  id="adm-album-title"
                  type="text"
                  required
                  placeholder="Thảo & Minh Hà Nội"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="adm-album-desc" className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  Mô tả album
                </label>
                <textarea
                  id="adm-album-desc"
                  rows={2}
                  placeholder="Viết lời chúc hoặc phong cách nghệ thuật..."
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="adm-album-location" className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                    Địa điểm
                  </label>
                  <input
                    id="adm-album-location"
                    type="text"
                    placeholder="Đồi thông Đà Lạt"
                    value={albumLocation}
                    onChange={(e) => setAlbumLocation(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adm-album-date" className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                    Ngày chụp
                  </label>
                  <input
                    id="adm-album-date"
                    type="text"
                    placeholder="25/05/2026"
                    value={albumDate}
                    onChange={(e) => setAlbumDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  Ảnh bìa Cover (URL hoặc tải tệp lên)
                </label>
                <div className="flex gap-2">
                  <input
                    id="adm-album-cover"
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={albumCover}
                    onChange={(e) => setAlbumCover(e.target.value)}
                    className="flex-1 bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors font-mono"
                  />
                  <div className="relative bg-stone-900 hover:bg-stone-850 px-3 flex items-center justify-center border border-stone-800 text-xs text-stone-300 font-light cursor-pointer">
                    <span className="whitespace-nowrap">Tải tệp</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCreateCover}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                {albumCover ? (
                  <div className="relative mt-2 border border-stone-800 p-1 bg-stone-950">
                    <img src={albumCover} alt="Review cover" className="w-full h-24 object-cover opacity-80" />
                    <button
                      type="button"
                      onClick={() => setAlbumCover('')}
                      className="absolute top-2 right-2 bg-rose-955/90 text-rose-400 border border-rose-900/50 px-2 py-1 text-[9px] uppercase font-mono hover:bg-rose-900 hover:text-white transition-colors cursor-pointer"
                    >
                      Xóa bìa
                    </button>
                  </div>
                ) : (
                  <p className="text-[9px] text-stone-600">Nếu bỏ trống, hệ thống sẽ tự động lấy hình ảnh đầu tiên bạn tải lên làm bìa đại diện.</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="adm-album-pass" className="block text-[10px] uppercase tracking-wider text-stone-400 font-mono">
                  Mật khẩu bảo vệ (Nếu muốn bảo mật)
                </label>
                <input
                  id="adm-album-pass"
                  type="text"
                  placeholder="Để trống để bàn giao công khai"
                  value={albumPassword}
                  onChange={(e) => setAlbumPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-900 rounded-none p-3 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500 transition-colors font-mono text-center tracking-widest"
                />
              </div>

              <button
                id="create-album-submit-btn"
                type="submit"
                className="w-full mt-4 bg-stone-100 hover:bg-stone-250 text-stone-950 font-medium text-xs py-3 rounded-none uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                + Khởi tạo Album trống
              </button>
            </form>
          </div>

          {/* Album Operations / Edit files (Right Side) */}
          <div className="lg:col-span-2 space-y-6">
            {editingAlbumId === null ? (
              <div className="bg-stone-900/40 p-6 sm:p-8 rounded-none border border-stone-900">
                <h3 className="font-serif text-xl text-stone-100 font-light tracking-wide mb-6 italic">
                  Danh sách Album đang hoạt động
                </h3>

                <div className="space-y-4">
                  {albums.map((alb) => (
                    <div
                      key={alb.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-stone-950 border border-stone-900 rounded-none hover:border-stone-700 transition-all duration-300 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={alb.coverUrl}
                          alt={alb.title}
                          className="w-16 h-16 rounded-none object-cover border border-stone-900"
                        />
                        <div>
                          <h4 className="font-serif text-md text-stone-100 font-normal">{alb.title}</h4>
                          <p className="text-[10px] text-stone-500 font-mono uppercase tracking-wider mt-1">
                            {alb.date} — {alb.location} — {alb.images.length} ảnh
                          </p>
                          {alb.password && (
                            <span className="inline-block bg-rose-950/40 text-rose-400 border border-rose-900/40 rounded-none px-1.5 py-0.5 text-[9px] font-mono mt-1">
                              🔒 MẬT KHẨU: {alb.password}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          id={`manage-photos-btn-${alb.id}`}
                          type="button"
                          onClick={() => setEditingAlbumId(alb.id)}
                          className="px-3 py-1.5 rounded-none bg-stone-905 border border-stone-800 hover:bg-stone-800 text-stone-300 hover:text-white text-xs uppercase tracking-widest font-light transition-colors cursor-pointer"
                        >
                          Quản lý ảnh ({alb.images.length})
                        </button>
                        <button
                          id={`del-album-btn-${alb.id}`}
                          type="button"
                          onClick={() => handleDeleteAlbum(alb.id)}
                          className="p-1.5 rounded-none bg-transparent text-stone-600 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Xóa bộ album"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // EDITING SPECIFIC ALBUM'S PHOTO CONTENT
              <div className="bg-stone-900/40 p-6 sm:p-8 rounded-none border border-stone-900 space-y-8 animate-fade-in">
                <div className="flex items-center justify-between border-b border-stone-900 pb-4">
                  <div>
                    <button
                      id="back-list-albums"
                      type="button"
                      onClick={() => setEditingAlbumId(null)}
                      className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-300 mb-2 flex items-center gap-1.5 cursor-pointer"
                    >
                      ← Trở về danh sách
                    </button>
                    <h3 className="font-serif text-2xl text-stone-100 font-light italic">
                      Quản lý: {editingAlbum?.title}
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400 font-mono font-bold bg-stone-950 px-3 py-1 rounded-none border border-stone-850">
                    Tổng: {editingAlbum?.images.length || 0} ảnh
                  </span>
                </div>

                {/* ALBUM INFORMATION AND COVER ART MANAGER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-stone-950 p-6 border border-stone-850 rounded-none text-left">
                  {/* Left block: Custom Cover Art preview & uploader */}
                  <div className="lg:col-span-1 space-y-4">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#d97706] font-bold">
                      📸 ẢNH BÌA ĐẠI DIỆN ALBUM
                    </h4>
                    
                    <div className="relative aspect-video w-full bg-stone-900 border border-stone-800 overflow-hidden flex items-center justify-center">
                      {editCover ? (
                        <img src={editCover} alt="Cover Preview" className="w-full h-full object-cover opacity-75" />
                      ) : (
                        <div className="text-center p-4">
                          <span className="block font-serif text-xs italic text-stone-600">Chưa thiết lập ảnh bìa riêng</span>
                          <span className="text-[9px] font-mono text-stone-550 block mt-1 uppercase">Tự động lấy ảnh đầu tiên</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-stone-600 text-center text-xs font-light tracking-widest uppercase transition-all duration-300 cursor-pointer">
                          <span>Tải ảnh bìa mới</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadEditCover}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                        {editCover && (
                          <button
                            type="button"
                            onClick={handleClearEditCover}
                            className="px-3 bg-rose-950/40 text-rose-450 border border-rose-900/60 hover:bg-rose-905 hover:text-white transition-colors text-xs uppercase tracking-wider cursor-pointer font-mono"
                          >
                            Xóa bìa
                          </button>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="edit-cover-url-field" className="block text-[9px] uppercase tracking-wider text-stone-500 font-mono">Dán link URL ảnh bìa:</label>
                        <input
                          id="edit-cover-url-field"
                          type="text"
                          placeholder="https://..."
                          value={editCover}
                          onChange={(e) => {
                            setEditCover(e.target.value);
                            const updated = albums.map(a => a.id === editingAlbumId ? { ...a, coverUrl: e.target.value } : a);
                            onSaveAlbums(updated);
                          }}
                          className="w-full bg-stone-950 border border-stone-900 p-2 text-[10px] text-stone-300 font-mono placeholder-stone-850 focus:outline-none focus:border-stone-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right block: Form edit core details */}
                  <form onSubmit={handleUpdateAlbumProperties} className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] uppercase font-mono tracking-widest text-stone-300 font-bold mb-4">
                        ✎ BẢN CỤ THỂ THÔNG TIN ALBUM
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label htmlFor="edit-title-field" className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">Tên Album *</label>
                          <input
                            id="edit-title-field"
                            type="text"
                            required
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="edit-pass-field" className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">Mật khẩu bảo mật</label>
                          <input
                            id="edit-pass-field"
                            type="text"
                            placeholder="Để trống để công khai..."
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-200 focus:outline-none focus:border-stone-500 font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="edit-location-field" className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">Địa điểm</label>
                          <input
                            id="edit-location-field"
                            type="text"
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="edit-date-field" className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">Ngày chụp</label>
                          <input
                            id="edit-date-field"
                            type="text"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-200 focus:outline-none focus:border-stone-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 mt-3">
                        <label htmlFor="edit-desc-field" className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">Mô tả album</label>
                        <textarea
                          id="edit-desc-field"
                          rows={2}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 p-2.5 text-xs text-stone-250 focus:outline-none focus:border-stone-500 resize-none font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-950 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer self-end rounded-none"
                    >
                      ✓ Cập nhật thông tin Album
                    </button>
                  </form>
                </div>

                {/* Sub-upload mechanisms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-950 p-5 rounded-none border border-stone-900">
                  {/* File Upload Selector (Base64 uploads) */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-stone-300 font-bold">
                      Hộp thả ảnh kéo thả (Upload từ máy)
                    </h4>
                    
                    <div className="relative border border-dashed border-stone-800 hover:border-stone-500 rounded-none h-32 flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group">
                      <input
                        id="base64-uploader"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, editingAlbum!.id)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploadingBase64}
                      />
                      {isUploadingBase64 ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <svg className="animate-spin h-6 w-6 text-stone-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-xs text-stone-400 font-mono">Đang nén & lưu ảnh...</span>
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-stone-600 group-hover:text-stone-300 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                          <span className="text-[11px] text-stone-400 text-center mt-2 group-hover:text-stone-200 transition-colors font-sans">
                            Kéo thả nhiều tệp hoặc nhấn để chọn ảnh tải lên
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Add Individual via URL Route */}
                  <form onSubmit={(e) => handleAddCustomPhoto(e, editingAlbum!.id)} className="space-y-3">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-stone-300 font-bold">
                      Thêm qua liên kết ảnh (Image URL)
                    </h4>
                    <div className="space-y-2">
                      <input
                        id="custom-p-url"
                        type="text"
                        required
                        placeholder="Nhập link ảnh https://..."
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-900 rounded-none px-2.5 py-1.5 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500"
                      />
                      <input
                        id="custom-p-title"
                        type="text"
                        placeholder="Tên hoặc chú thích ảnh (nhỏ)"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-900 rounded-none px-2.5 py-1.5 text-xs text-stone-100 placeholder-stone-800 focus:outline-none focus:border-stone-500"
                      />
                      <button
                        id="add-p-url-btn"
                        type="submit"
                        className="w-full py-1.5 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 hover:border-stone-550 text-xs rounded-none transition-colors cursor-pointer font-light uppercase tracking-widest"
                      >
                        Thêm vào Grid ảnh
                      </button>
                    </div>
                  </form>
                </div>

                {/* Single Click Preset Adder */}
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
                    Thêm nhanh ảnh demo từ Thanh Thảo Studio:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_WEDDING_PHOTOS.map((sam, sidx) => (
                      <button
                        key={sidx}
                        type="button"
                        onClick={() => handleAddSamplePhoto(sam, editingAlbum!.id)}
                        className="flex items-center gap-1.5 text-[10px] text-stone-400 bg-stone-950 border border-stone-900 hover:bg-stone-850 hover:text-stone-100 px-2.5 py-1.5 rounded-none transition-colors cursor-pointer"
                      >
                        <img src={sam.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                        + {sam.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid list of images inside album with setting-cover & delete */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-mono text-stone-300 font-bold">
                    Các ảnh đang có trong Album:
                  </h4>

                  {editingAlbum && editingAlbum.images.length === 0 ? (
                    <div className="text-center py-10 text-stone-500 text-xs font-light bg-stone-950 border border-stone-900 rounded-none">
                      Chưa có hình ảnh nào trong album này. Hãy upload ảnh ở phía trên!
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {editingAlbum?.images.map((photo) => (
                        <div 
                          key={photo.id}
                          className={`relative group aspect-square rounded-none overflow-hidden bg-stone-950 border ${
                            editingAlbum.coverUrl === photo.url ? 'border-amber-500' : 'border-stone-900'
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt=""
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />

                          {/* Image ID Stamp */}
                          <div className="absolute top-1 left-1 px-1 py-0.5 rounded-none bg-stone-950/85 text-[8px] font-mono text-stone-400">
                            ID: {photo.id}
                          </div>

                          {/* Cover badge if matched */}
                          {editingAlbum.coverUrl === photo.url && (
                            <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-none bg-amber-500 text-stone-950 text-[8px] font-mono font-bold uppercase tracking-wider">
                              Ảnh bìa
                            </div>
                          )}

                          {/* Control action bar on hover */}
                          <div className="absolute inset-x-0 bottom-0 bg-stone-950/90 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-1">
                            <button
                              id={`set-cover-btn-${photo.id}`}
                              type="button"
                              onClick={() => handleSetCover(editingAlbum.id, photo.url)}
                              className="text-[8px] uppercase tracking-wider bg-stone-900 hover:bg-stone-100 hover:text-stone-950 border border-stone-800 text-stone-300 px-1.5 py-1 rounded-none transition-colors whitespace-nowrap cursor-pointer"
                            >
                              Làm ảnh bìa
                            </button>
                            <button
                              id={`remove-img-btn-${photo.id}`}
                              type="button"
                              onClick={() => handleRemovePhoto(editingAlbum.id, photo.id)}
                              className="p-1 rounded-none bg-transparent text-stone-500 hover:text-rose-500 hover:bg-stone-900 transition-colors cursor-pointer"
                              title="Xóa khỏi album"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTAINER 2: Selected Client Favorites List */}
      {activeTab === 'favorites' && (
        <div className="bg-stone-900/40 p-6 sm:p-12 rounded-none border border-stone-900 animate-fade-in space-y-6">
          <div className="border-b border-stone-900 pb-4">
            <h3 className="font-serif text-xl text-stone-100 font-light tracking-wide italic">
              Danh sách Ảnh yêu thích khách gửi
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Thợ chụp ảnh & thợ chỉnh photoshop có thể xem, sao chép hoặc in nhanh theo danh sách mã ID khách chọn.
            </p>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-20 text-stone-500 text-xs font-light italic bg-stone-950 border border-stone-900 rounded-none">
              Chưa có danh sách chọn ảnh nào được gửi từ khách hàng.
            </div>
          ) : (
            <div className="space-y-8">
              {favorites.map((fav, fIndex) => (
                <div 
                  key={fIndex}
                  id={`fav-list-item-${fIndex}`}
                  className="bg-stone-950 p-6 rounded-none border border-stone-900 space-y-4 hover:border-stone-800 transition-colors"
                >
                  {/* Customer Information Column/Row Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-900 pb-3">
                    <div>
                      <h4 className="font-serif text-lg text-stone-100 font-light italic">
                        🤵👰 Khách hàng: <span className="text-stone-300 font-semibold">{fav.clientName}</span>
                      </h4>
                      <p className="text-xs text-stone-400 font-mono mt-1">
                        Zalo/SĐT: {fav.clientPhone || 'Không cung cấp'} | Album: <strong className="text-stone-200">{fav.albumId}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(fav.submittedAt).toLocaleString('vi-VN')}
                      </span>
                      <button
                        id={`clear-fav-btn-${fIndex}`}
                        type="button"
                        onClick={() => onClearFavorites(fIndex)}
                        className="text-xs text-stone-500 hover:text-rose-500 transition-colors uppercase font-mono tracking-wider border border-stone-900 hover:border-rose-900/30 px-2 py-1 rounded-none cursor-pointer"
                      >
                        Đã xử lý (Xóa)
                      </button>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {fav.notes && (
                    <div className="p-3 bg-stone-900/60 border border-stone-900 rounded-none text-xs text-stone-300 font-light italic">
                      <strong className="text-stone-400 uppercase tracking-widest text-[10px] font-mono block mb-1 not-italic">Ghi chú chỉnh sửa:</strong>
                      "{fav.notes}"
                    </div>
                  )}

                  {/* Highlight of Photo IDs Selected */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                      Mã ID ảnh đã chọn ({fav.photoIds.length} ảnh):
                    </h5>
                    <div className="bg-stone-900 p-3 rounded-none font-mono text-xs text-stone-300 border border-stone-900 select-all select-element">
                      {fav.photoIds.join(', ')}
                    </div>
                  </div>

                  {/* Visual Thumbnails block matching targets */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {fav.photoIds.map((pId) => {
                      // Attempt to search image URL in current albums
                      let imgUrl = '';
                      for (const alb of albums) {
                        const target = alb.images.find(im => im.id === pId);
                        if (target) {
                          imgUrl = target.url;
                          break;
                        }
                      }

                      return (
                        <div key={pId} className="relative aspect-square bg-stone-950 border border-stone-850 rounded-none overflow-hidden" title={pId}>
                          {imgUrl ? (
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-stone-500">
                              Unknown Photo
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-stone-950/80 rounded-none text-[8px] font-mono text-stone-400 px-1 border border-stone-900">
                            {pId}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTAINER 3: Deployment Step-by-Step for Newbies */}
      {activeTab === 'deploy' && (
        <div className="bg-stone-900/40 p-6 sm:p-12 rounded-none border border-stone-900 animate-fade-in space-y-8 text-stone-300">
          <div className="border-b border-stone-900 pb-5">
            <h3 className="font-serif text-2xl text-stone-100 font-light tracking-wide italic">
              Hướng dẫn Deploy Vercel & Cấu hình Domain Riêng
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-1">
              Các bước tinh gọn, chi tiết và mộc mạc nhất dành cho Thanh Thảo Studio để tự chạy website bằng thương hiệu riêng.
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-2">
              <h4 className="font-serif text-lg text-stone-100 font-light italic">
                Bước 1: Build và Export source code
              </h4>
              <p className="text-sm font-light leading-relaxed">
                Source code được lập trình theo mô hình Single Page Application (SPA), viết bằng <strong>React</strong> và <strong>Tailwind CSS</strong>, cho tốc độ tải cực kỳ nhanh gọn.
              </p>
              <ol className="list-decimal pl-5 text-xs space-y-1.5 text-stone-400 font-light">
                <li>Nén thư mục gốc chứa project thành một file <code className="bg-stone-950 px-1.5 py-0.5 rounded-none font-mono text-stone-100">.zip</code>.</li>
                <li>Hoặc đồng bộ và đẩy mã nguồn lên tài khoản GitHub cá nhân của bạn.</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <h4 className="font-serif text-lg text-stone-100 font-light italic">
                Bước 2: Đăng tải liên kết Vercel (Miễn Phí)
              </h4>
              <p className="text-sm font-light leading-relaxed">
                Vercel là nền tảng máy chủ hàng đầu thế giới được tối ưu hoàn hảo cho các ứng dụng React tốc độ cao.
              </p>
              <ol className="list-decimal pl-5 text-xs space-y-1.5 text-stone-400 font-light">
                <li>Truy cập trang chủ <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-stone-300 hover:text-white underline">Vercel.com</a> và đăng ký tài khoản miễn phí bằng tài khoản GitHub hoặc Google.</li>
                <li>Nhấn nút <strong>"Add New"</strong> sau đó chọn <strong>"Project"</strong>.</li>
                <li>Import kho lưu trữ GitHub chứa code gallery hoặc tải file <code className="bg-stone-950 px-1.5 py-0.5 rounded-none font-mono text-stone-100">.zip</code> lên trực tiếp.</li>
                <li>Trong trang cấu hình Build, giữ nguyên mọi cài đặt mặc định và nhấn <strong>"Deploy"</strong>.</li>
                <li>Website sẽ được kích hoạt trực tuyến sau 1 phút với một tên miền phụ có dạng <code className="text-stone-300">thanh-thao-gallery.vercel.app</code>.</li>
              </ol>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <h4 className="font-serif text-lg text-stone-100 font-light italic">
                Bước 3: Trỏ tên miền riêng thương hiệu (phuongtinastudio.vn)
              </h4>
              <p className="text-sm font-light leading-relaxed">
                Để website gallery ảnh của bạn trông sang trọng như Pixieset thực thụ ở địa chỉ <strong className="text-stone-100">phuongtinastudio.vn</strong> hoặc <strong className="text-stone-100">gallery.phuongtinastudio.vn</strong>:
              </p>
              <div className="bg-stone-950 p-5 rounded-none border border-stone-900 space-y-4">
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Đăng nhập vào trang quản trị của nhà cung cấp tên miền của bạn (ví dụ: Mắt Bão, PA Việt Nam, Nhân Hòa, v.v...) và thêm các bản ghi cấu hình DNS sau:
                </p>

                {/* Table for clean rendering of DNS pointers */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-800 text-stone-500 uppercase">
                        <th className="pb-2">Trường hợp</th>
                        <th className="pb-2">Loại (Type)</th>
                        <th className="pb-2">Tên (Host/Name)</th>
                        <th className="pb-2">Giá trị (Points to)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-900 text-stone-300">
                      <tr>
                        <td className="py-2.5">Tên miền chính (<code className="text-amber-200">phuongtinastudio.vn</code>)</td>
                        <td>A</td>
                        <td>@</td>
                        <td>76.76.21.21 <span className="text-[10px] text-stone-500 block sm:inline-block sm:ml-2">(IP máy chủ Vercel)</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5">Trang con gallery (<code className="text-amber-200">gallery.phuongtinastudio.vn</code>)</td>
                        <td>CNAME</td>
                        <td>gallery</td>
                        <td>cname.vercel-dns.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-stone-900/20 border border-stone-900 rounded-none text-xs text-stone-400 font-light">
                  💡 Sau khi trỏ DNS tại trang mua tên miền, quay lại trang Dashboard Vercel → chọn mục <strong>Project Settings</strong> → <strong>Domains</strong> → Nhập <code className="bg-stone-950 px-1.5 py-0.5 rounded-none font-mono text-stone-100 font-bold">gallery.phuongtinastudio.vn</code> rồi bấm Add. Hệ thống sẽ tự động cấp phát chứng chỉ SSL an toàn (HTTPS://) miễn phí trọn đời cho bạn.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-stone-900/40 p-6 sm:p-10 rounded-none border border-stone-900 animate-fade-in max-w-4xl mx-auto space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-stone-100 font-light tracking-wide mb-2 italic">
              ⚙️ Cấu hình Danh tính & Giao diện Website
            </h3>
            <p className="text-xs text-stone-500 font-mono tracking-widest uppercase mb-6">
              CHO PHÉP QUẢN TRỊ VIÊN SỬA BẤT KỲ MỤC NÀO TRÊN TRANG CHỦ & PHẦN CONTACT
            </p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (onSaveSettings) {
              onSaveSettings({
                brandName: settingsBrandName,
                brandSubtitle: settingsBrandSubtitle,
                brandSlogan: settingsBrandSlogan,
                aboutTitle: settingsAboutTitle,
                aboutText: settingsAboutText,
                hotline: settingsHotline,
                email: settingsEmail,
                address: settingsAddress,
                heroImageUrl: settingsHeroImageUrl,
                logoText: settingsLogoText,
                logoSubtitle: settingsLogoSubtitle,
                adminPassword: settingsAdminPassword,
              });
              triggerToast('Đã cập nhật giao diện & mật khẩu quản trị thành công!');
            }
          }} className="space-y-6 text-stone-300">
            
            {/* Section 1: Logo & Brand Header */}
            <div className="border-b border-stone-850 pb-6 space-y-4">
              <h4 className="text-sm font-sans tracking-widest uppercase text-stone-400 font-medium">1. Logo Góc & Tiêu Đề Header</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Chữ hiển thị Logo</label>
                  <input
                    type="text"
                    required
                    value={settingsLogoText}
                    onChange={(e) => setSettingsLogoText(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Mô tả nhỏ dưới Logo</label>
                  <input
                    type="text"
                    required
                    value={settingsLogoSubtitle}
                    onChange={(e) => setSettingsLogoSubtitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Hero Section */}
            <div className="border-b border-stone-850 pb-6 space-y-4">
              <h4 className="text-sm font-sans tracking-widest uppercase text-stone-400 font-medium">2. Banner Lớn Trang Chủ (Hero)</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Tên thương hiệu lớn</label>
                    <input
                      type="text"
                      required
                      value={settingsBrandName}
                      onChange={(e) => setSettingsBrandName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm font-serif font-light text-amber-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Dòng tiêu đề phụ (Subtitle)</label>
                    <input
                      type="text"
                      required
                      value={settingsBrandSubtitle}
                      onChange={(e) => setSettingsBrandSubtitle(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Slogan / Trích dẫn (Ý nghĩa)</label>
                  <input
                    type="text"
                    required
                    value={settingsBrandSlogan}
                    onChange={(e) => setSettingsBrandSlogan(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm italic font-light font-serif"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Ảnh nền Banner chính (Hero Image)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settingsHeroImageUrl}
                      onChange={(e) => setSettingsHeroImageUrl(e.target.value)}
                      placeholder="Nhập đường dẫn liên kết hoặc bấm Tải tệp mới..."
                      className="flex-1 bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-xs font-mono"
                    />
                    <div className="relative bg-stone-900 hover:bg-stone-850 px-4 flex items-center justify-center border border-stone-800 text-xs text-stone-300 font-light cursor-pointer">
                      <span className="whitespace-nowrap">Tải tệp</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadHeroImage}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                    {settingsHeroImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setSettingsHeroImageUrl('');
                          triggerToast('Đã xóa ảnh nền chính.');
                        }}
                        className="bg-stone-900 border border-stone-800 text-rose-400 px-4 hover:bg-rose-950/20 hover:text-rose-300 text-xs cursor-pointer whitespace-nowrap"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  {settingsHeroImageUrl && (
                    <div className="relative mt-2 border border-stone-800 p-1 bg-stone-950">
                      <img src={settingsHeroImageUrl} alt="Review hero" className="w-full h-32 object-cover opacity-80" />
                    </div>
                  )}
                  <p className="text-[10px] text-stone-500 mt-1">Bạn có thể tự do dán liên kết ảnh từ bất cứ đâu, hoặc tải tệp trực tiếp từ thiết bị của bạn.</p>
                </div>
              </div>
            </div>

            {/* Section 3: About Us section */}
            <div className="border-b border-stone-850 pb-6 space-y-4">
              <h4 className="text-sm font-sans tracking-widest uppercase text-stone-400 font-medium">3. Giới thiệu Studio (About Us)</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Tiêu đề phần Giới thiệu</label>
                  <input
                    type="text"
                    required
                    value={settingsAboutTitle}
                    onChange={(e) => setSettingsAboutTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Nội dung chi tiết (Đoạn văn giới thiệu thương hiệu)</label>
                  <textarea
                    rows={4}
                    required
                    value={settingsAboutText}
                    onChange={(e) => setSettingsAboutText(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-3 text-stone-100 focus:outline-none focus:border-stone-400 text-sm font-light leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Studio Contact information */}
            <div className="pb-4 space-y-4">
              <h4 className="text-sm font-sans tracking-widest uppercase text-stone-400 font-medium">4. Thông Tin Liên Hệ (Chân trang - Footer)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Hotline (Số điện thoại)</label>
                  <input
                    type="text"
                    required
                    value={settingsHotline}
                    onChange={(e) => setSettingsHotline(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Email chính</label>
                  <input
                    type="text"
                    required
                    value={settingsEmail}
                    onChange={(e) => setSettingsEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm font-mono text-stone-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Địa chỉ đầy đủ</label>
                <input
                  type="text"
                  required
                  value={settingsAddress}
                  onChange={(e) => setSettingsAddress(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-850 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-stone-400 text-sm"
                />
              </div>
            </div>

            {/* Section 5: Admin Password settings */}
            <div className="pb-4 space-y-4 border-t border-stone-900 pt-6">
              <h4 className="text-sm font-sans tracking-widest uppercase text-amber-500 font-medium">5. Thiết lập Bảo mật Quản trị viên</h4>
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1.5 font-medium">Mật khẩu Đăng nhập Trực tiếp Quản trị viên *</label>
                <input
                  type="text"
                  required
                  value={settingsAdminPassword}
                  onChange={(e) => setSettingsAdminPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-900/40 px-4 py-2.5 text-stone-100 focus:outline-none focus:border-amber-500 text-sm font-mono text-amber-400 placeholder-stone-800"
                  placeholder="Nhập mật khẩu quản trị..."
                />
                <p className="text-[10px] text-stone-500 mt-1">Dùng mật khẩu này để đăng nhập vào trang Quản trị viên và sử dụng các tính năng đăng ảnh nhanh trực tiếp trong Album.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-900 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-stone-100 text-stone-950 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-stone-200 transition-all duration-300 shadow-md cursor-pointer"
              >
                💾 Lưu Thay Đổi Giao Diện
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
