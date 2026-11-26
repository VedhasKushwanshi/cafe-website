import React from 'react';
import { Coffee, Flame, QrCode, Star, Wifi } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CAFE_IMAGES, CUSTOMER_REVIEWS } from '../data/cafeData';
import { GalleryGrid } from '../components/GalleryLightbox';
import { SafeImage } from '../components/SafeImage';

export function AboutPage() {
  const { navigate } = useCafe();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Story Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs font-semibold text-[#C88746]">
            Chai &amp; Coc Café · Where Chai Meets Coffee
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#3B2416] leading-tight text-balance">
            More Than Just a Café.
          </h1>
          <p className="text-base text-[#6F4E37] leading-relaxed">
            Chai &amp; Coc Café brings together the comfort of traditional chai and the energy of
            modern coffee culture. Whether you&apos;re catching up with friends, finishing an
            assignment, working on your next big idea or simply enjoying a quiet cup, we&apos;ve
            created a space where everyone feels welcome.
          </p>
          <p className="text-sm sm:text-base text-[#6F4E37] leading-relaxed">
            Born right across from UPES Bidholi in the green foothills of Dehradun, we source
            single-estate Chikmagalur Arabica beans alongside fresh Assam CTC leaves, whole green
            cardamom, and hand-fired terracotta kulhads — served through a fast, thoughtful digital
            experience.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className="px-5 py-3 rounded-xl bg-[#3B2416] text-[#FFFDF9] text-sm font-semibold hover:bg-[#C88746] transition-colors cursor-pointer"
            >
              Explore Our Menu
            </button>
            <button
              type="button"
              onClick={() => navigate('/reservation')}
              className="px-5 py-3 rounded-xl border border-[#E8D5BC] text-sm font-semibold text-[#3B2416] hover:bg-[#FFF4E6] transition-colors cursor-pointer"
            >
              Reserve a Table
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-[#E8D5BC] shadow-md">
          <SafeImage
            src={CAFE_IMAGES.hero}
            alt="Inside Chai & Coc Café UPES Bidholi"
            className="w-full h-full min-h-[340px] object-cover"
          />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Flame,
            title: 'Traditional Indian Chai',
            desc: 'Simmered in small batches with fresh ginger, green elaichi, cinnamon, and poured hot into earthy kulhads.',
          },
          {
            icon: Coffee,
            title: 'Modern Specialty Coffee',
            desc: 'Medium-dark Chikmagalur Arabica pulled fresh on precision espresso machines, available with oat and almond milk.',
          },
          {
            icon: QrCode,
            title: 'Smart Café Technology',
            desc: 'Instant table QR ordering, live brew status tracking, C&C Rewards, and Coco — your personal AI café guide.',
          },
        ].map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="rounded-2xl bg-[#FFF4E6]/55 border border-[#E8D5BC] p-6 space-y-3"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#3B2416] text-[#FFF4E6] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#3B2416]">{pillar.title}</h2>
              <p className="text-sm text-[#6F4E37] leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Full Café Gallery */}
      <section id="gallery" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-[#C88746] mb-1">Atmosphere &amp; Craft</p>
            <h2 className="font-serif text-3xl font-semibold text-[#3B2416]">Café Gallery</h2>
          </div>
          <p className="text-sm text-[#6F4E37]">
            Tap any image to open the full-screen lightbox
          </p>
        </div>
        <GalleryGrid />
      </section>

      {/* Community Reviews */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#C88746] mb-1">4.8 / 5 Rated by Guests</p>
            <h2 className="font-serif text-3xl font-semibold text-[#3B2416]">
              Loved by Our Community ❤️
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm text-[#6F4E37]">
            <Wifi className="w-4 h-4 text-[#C88746]" />
            <span>Built for UPES Bidholi &amp; Dehradun</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CUSTOMER_REVIEWS.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-[#FFFDF9] border border-[#E8D5BC] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 text-[#C88746] mb-2.5">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#C88746]" />
                  ))}
                </div>
                <p className="text-sm text-[#3B2416] leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8D5BC]/60">
                <p className="text-sm font-semibold text-[#3B2416]">{r.name}</p>
                <p className="text-xs text-[#6F4E37]">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
