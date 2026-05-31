import { Album } from './types';

export const INITIAL_ALBUMS: Album[] = [
  {
    id: 'l-amour-eternel',
    slug: 'l-amour-eternel',
    title: "L'Amour Éternel",
    description: "Bộ ảnh cưới mang phong cách Fine-art trong vắt giữa khung cảnh hùng vĩ của di sản Tràng An - Ninh Bình. Sự hòa quyện tuyệt mỹ giữa tình yêu đôi lứa và thiên nhiên tráng lệ.",
    coverUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
    date: '15/05/2026',
    location: 'Tràng An, Ninh Bình',
    createdAt: '2026-05-15T08:00:00Z',
    images: [
      {
        id: 'ae-1',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
        title: 'Nụ hôn bình minh trên dòng sào khê',
        aspect: 'landscape'
      },
      {
        id: 'ae-2',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
        title: 'Hoàng hôn rực rỡ bên vách đá',
        aspect: 'landscape'
      },
      {
        id: 'ae-3',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
        title: 'Chân dung cô dâu dưới nắng mai',
        aspect: 'portrait'
      },
      {
        id: 'ae-4',
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200',
        title: 'Cái nắm tay ấm áp giữa mây ngàn',
        aspect: 'portrait'
      },
      {
        id: 'ae-5',
        url: 'https://images.unsplash.com/photo-1507504038482-76210062ecee?q=80&w=1200',
        title: 'Chạy về phía mặt trời',
        aspect: 'landscape'
      },
      {
        id: 'ae-6',
        url: 'https://images.unsplash.com/photo-1502472545311-6218ecd09123?q=80&w=1200',
        title: 'Khung cảnh lung linh khi lên đèn',
        aspect: 'landscape'
      }
    ]
  },
  {
    id: 'the-classic-noir',
    slug: 'the-classic-noir',
    title: 'The Classic Noir',
    description: 'Bộ sưu tập ảnh cưới chân dung tối giản theo phong cách đen trắng kinh điển đón đầu xu hướng. Tập trung trọn vẹn vào cảm xúc thuần khiết, ánh sáng điện ảnh nghệ thuật.',
    coverUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200',
    date: '20/05/2026',
    location: 'Phương Tina Studio, TP.HCM',
    createdAt: '2026-05-20T10:30:00Z',
    images: [
      {
        id: 'cn-1',
        url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200',
        title: 'Nét kiêu sa cổ điển',
        aspect: 'portrait'
      },
      {
        id: 'cn-2',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200',
        title: 'Góc nhìn điện ảnh',
        aspect: 'portrait'
      },
      {
        id: 'cn-3',
        url: 'https://images.unsplash.com/photo-1621453123010-09e8674db5e6?q=80&w=1200',
        title: 'Dáng ngọc đài các',
        aspect: 'portrait'
      },
      {
        id: 'cn-4',
        url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=1200',
        title: 'Trao nhẫn thệ ước',
        aspect: 'landscape'
      },
      {
        id: 'cn-5',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200',
        title: 'Nụ cười rạng ngời',
        aspect: 'portrait'
      }
    ]
  },
  {
    id: 'dalat-pine-whisper',
    slug: 'dalat-pine-whisper',
    title: 'Đà Lạt Pine Whisper',
    description: 'Album bảo mật khóa mật khẩu dành riêng cho chú rể Minh và cô dâu Thảo. Buổi chiều mộng mơ trên đồi thông thơ mộng trong làn sương mù ban chiều đặc trưng Đà Lạt.',
    coverUrl: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=1200',
    date: '28/05/2026',
    location: 'Đồi thông Mimosa, Đà Lạt',
    password: '123', // Demo password
    createdAt: '2026-05-28T14:45:00Z',
    images: [
      {
        id: 'pw-1',
        url: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=1200',
        title: 'Sương sớm đồi thông',
        aspect: 'landscape'
      },
      {
        id: 'pw-2',
        url: 'https://images.unsplash.com/photo-1502472545311-6218ecd09123?q=80&w=1200',
        title: 'Vòng ôm ấm áp giữa trời lạnh',
        aspect: 'landscape'
      },
      {
        id: 'pw-3',
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
        title: 'Hạnh phúc ngập tràn dưới vòm thông',
        aspect: 'landscape'
      },
      {
        id: 'pw-4',
        url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200',
        title: 'Ánh mắt tìm về nhau',
        aspect: 'portrait'
      }
    ]
  }
];
