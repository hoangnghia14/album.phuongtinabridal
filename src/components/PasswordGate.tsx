import React, { useState } from 'react';

interface PasswordGateProps {
  albumTitle: string;
  albumCover: string;
  onUnlock: (password: string) => boolean;
  onBack: () => void;
}

export default function PasswordGate({ albumTitle, albumCover, onUnlock, onBack }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(password);
    if (!success) {
      setError(true);
      // Reset error after 2 seconds
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div 
      className="relative min-h-[80vh] flex items-center justify-center bg-[#0c0a09] overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Image Blurry Accent */}
      <div className="absolute inset-0 z-0">
        <img
          src={albumCover}
          alt={albumTitle}
          className="w-full h-full object-cover opacity-15 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-[#0c0a09]/90" />
        <div className="absolute inset-0 vintage-overlay" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8 bg-stone-900/40 p-8 sm:p-12 border border-stone-900 rounded-none backdrop-blur-xl">
        {/* Lock Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-none bg-stone-950 border border-stone-850">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1} 
            stroke="currentColor" 
            className="w-6 h-6 text-stone-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <div>
          <h2 className="font-serif text-3xl font-light tracking-wide text-stone-150 uppercase italic">
            Bộ Ảnh Bảo Mật
          </h2>
          <p className="mt-2 text-sm text-stone-400 font-sans tracking-wide leading-relaxed">
            Mở khóa bộ ảnh cưới của bạn. Vui lòng liên hệ Phương Tina Studio nếu gặp sự cố.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-none shadow-sm -space-y-px">
            <div>
              <label htmlFor="album-password" className="sr-only">Mật khẩu</label>
               <input
                id="album-password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mã truy cập (ví dụ: 123)"
                className={`appearance-none relative block w-full px-4 py-3.5 border rounded-none bg-stone-950 text-center font-mono placeholder-stone-600 focus:outline-none focus:ring-1 transition-all duration-300 ${
                  error 
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-300 animate-shake' 
                    : 'border-stone-800 focus:border-stone-300 focus:ring-stone-300 text-stone-100'
                }`}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-sans tracking-wider animate-pulse">
              Mã truy cập không đúng. Vui lòng liên hệ Phương Tina Studio.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="back-btn-gate"
              type="button"
              onClick={onBack}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-stone-800 rounded-none text-xs font-sans uppercase tracking-[0.2em] font-light text-stone-450 hover:text-stone-100 hover:bg-stone-900 transition-colors duration-300"
            >
              Quay Lại
            </button>
            <button
              id="submit-password-btn"
              type="submit"
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-stone-100 bg-stone-100 text-stone-950 font-medium text-xs font-sans uppercase tracking-[0.2em] hover:bg-stone-200 hover:text-stone-950 transition-all duration-300 shadow-md hover:shadow-lg rounded-none"
            >
              Mở khóa bộ ảnh
            </button>
          </div>
        </form>

        <p className="text-[10px] text-stone-600 font-mono tracking-widest mt-4 uppercase">
          PHƯƠNG TINA BRIDAL • SECURED GATEWAY
        </p>
      </div>
    </div>
  );
}
