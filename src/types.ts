export interface Photo {
  id: string;
  url: string;
  title?: string;
  aspect: 'portrait' | 'landscape' | 'square';
  watermarkText?: string;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverUrl: string;
  date: string;
  location: string;
  password?: string;
  images: Photo[];
  createdAt: string;
}

export interface FavoriteList {
  clientName: string;
  clientPhone?: string;
  albumId: string;
  photoIds: string[];
  notes?: string;
  submittedAt: string;
}

export interface StudioSettings {
  brandName: string;
  brandSubtitle: string;
  brandSlogan: string;
  aboutTitle: string;
  aboutText: string;
  hotline: string;
  email: string;
  address: string;
  heroImageUrl: string;
  logoText: string;
  logoSubtitle: string;
  adminPassword?: string;
}

