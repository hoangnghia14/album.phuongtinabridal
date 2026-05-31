import React from 'react';
import { StudioSettings } from '../types';

interface StudioFooterProps {
  onNavigate: (page: string) => void;
  studioSettings?: StudioSettings;
}

export default function StudioFooter({ onNavigate, studioSettings }: StudioFooterProps) {
  const brandName = studioSettings?.brandName || 'PHƯƠNG TINA BRIDAL';
  const hotline = studioSettings?.hotline || '0976.277.463 - 0839.855.888';
  const email = studioSettings?.email || 'hello@phuongtinastudio.vn';
  const address = studioSettings?.address || '18 - Dh2 - Kp7 - P. Chánh Phú Hoà ( Bến Cát - Bình Dương ) - TP. Hồ Chí Minh';
  const mainDomain = email.includes('@') ? email.split('@')[1] : 'phuongtinastudio.vn';

  return (
    <footer className="border-t border-stone-900 bg-stone-950 py-16 mt-20 transition-all duration-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-stone-400">
        {/* Left Col: Brand and tagline */}
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-xl tracking-[0.3em] text-stone-100 font-light uppercase italic">
            {brandName}
          </h2>
          <p className="text-sm font-light leading-relaxed text-stone-400 font-sans">
            Mỗi bức ảnh là một tác phẩm nghệ thuật, mỗi khoảnh khắc là một câu chuyện tình vĩ cửu dựng xây theo chuẩn mực Pixieset cao quý.
          </p>
          <p className="text-xs text-stone-500 mt-2">
            © {new Date().getFullYear()} {brandName} Gallery. All rights reserved.
          </p>
        </div>

        {/* Center Col: Contacts */}
        <div className="flex flex-col gap-3 text-sm font-light">
          <h3 className="font-serif text-md text-stone-100 tracking-widest uppercase mb-2">
            STUDIO CONTACT
          </h3>
          <p className="flex items-center gap-2">
            <span className="text-stone-300">Hotline:</span> {hotline}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-stone-300">Email:</span> {email}
          </p>
          <p className="flex items-center gap-2">
            <span className="text-stone-300">Địa chỉ:</span> {address}
          </p>
        </div>

        {/* Right Col: Domains and quick instructions info */}
        <div className="flex flex-col gap-3 text-sm font-light">
          <h3 className="font-serif text-md text-stone-100 tracking-widest uppercase mb-2">
            BÀN GIAO CHUYÊN NGHIỆP
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Hệ thống gallery hỗ trợ lưu trữ ảnh cưới trực tuyến chuẩn tốc độ cao, hỗ trợ liên kết các tên miền riêng đẳng cấp:
          </p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-stone-900/40 px-3 py-2 rounded-none border border-stone-850">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"></span>
              {mainDomain}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-stone-900/40 px-3 py-2 rounded-none border border-stone-850">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse"></span>
              gallery.{mainDomain}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
