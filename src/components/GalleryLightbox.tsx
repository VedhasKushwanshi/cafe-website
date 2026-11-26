import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { GALLERY_PHOTOS } from '../data/cafeData';
import { SafeImage } from './SafeImage';

export function GalleryGrid({ limit }: { limit?: number }) {
  const { setLightboxIndex } = useCafe();
  const photos = limit ? GALLERY_PHOTOS.slice(0, limit) : GALLERY_PHOTOS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => setLightboxIndex(index)}
          className={`group relative overflow-hidden rounded-2xl bg-[#FFF4E6] text-left cursor-pointer border border-[#E8D5BC]/60 focus-visible:ring-2 focus-visible:ring-[#C88746] ${
            photo.aspect === 'wide' ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-[4/3]'
          }`}
        >
          <SafeImage
            src={photo.image}
            alt={photo.title}
            fallbackLabel={photo.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F]/80 via-[#1F1F1F]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFFDF9]/90 text-[#3B2416] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-3.5 h-3.5" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 text-[#FFFDF9]">
            <p className="text-[11px] font-medium text-[#E8D5BC]">{photo.category}</p>
            <h3 className="font-serif text-base font-semibold leading-snug mt-0.5">
              {photo.title}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}

export function GalleryLightbox() {
  const { lightboxIndex, setLightboxIndex } = useCafe();

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((lightboxIndex + 1) % GALLERY_PHOTOS.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((lightboxIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, setLightboxIndex]);

  if (lightboxIndex === null) return null;
  const activePhoto = GALLERY_PHOTOS[lightboxIndex];
  if (!activePhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1F1F1F]/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={() => setLightboxIndex(null)}
      role="dialog"
      aria-modal="true"
      aria-label={activePhoto.title}
    >
      <button
        type="button"
        onClick={() => setLightboxIndex(null)}
        aria-label="Close photo lightbox"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-[#FFFDF9] hover:bg-white/20 flex items-center justify-center cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLightboxIndex((lightboxIndex - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
        }}
        aria-label="Previous photo"
        className="absolute left-3 sm:left-6 w-10 h-10 rounded-full bg-white/10 text-[#FFFDF9] hover:bg-white/20 flex items-center justify-center cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        className="max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-h-[72vh] overflow-hidden rounded-2xl border border-white/15 bg-[#3B2416]">
          <SafeImage
            src={activePhoto.image}
            alt={activePhoto.title}
            loading="eager"
            className="w-full h-full max-h-[72vh] object-contain"
          />
        </div>
        <div className="mt-4 text-center max-w-xl">
          <p className="text-xs font-medium text-[#C88746]">
            {activePhoto.category} · {lightboxIndex + 1} / {GALLERY_PHOTOS.length}
          </p>
          <h3 className="font-serif text-xl font-semibold text-[#FFFDF9] mt-1">
            {activePhoto.title}
          </h3>
          <p className="text-sm text-[#E8D5BC] mt-1">{activePhoto.caption}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setLightboxIndex((lightboxIndex + 1) % GALLERY_PHOTOS.length);
        }}
        aria-label="Next photo"
        className="absolute right-3 sm:right-6 w-10 h-10 rounded-full bg-white/10 text-[#FFFDF9] hover:bg-white/20 flex items-center justify-center cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
