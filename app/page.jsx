import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import { getPosts } from '../lib/firestore';

export const revalidate = 3600; // 1 hour cache // ISR — refresh every 60s

export const metadata = {
  title: 'StyleHub Decors — Curated Fashion & Home Decor on Amazon India',
  description: 'Discover handpicked Amazon fashion & home decor finds. Curated weekly for taste-makers.',
};

const MARQUEE_ITEMS = [
  'Amazon Fashion Finds', 'Home Decor Inspo', 'Trending Picks',
  'Curated Weekly', 'Under ₹999', 'Room Setup Ideas',
  'Quiet Luxury', 'Aesthetic Living', 'Pinterest Worthy',
];

const CATEGORIES = [
  {
    href: '/fashion',
    label: 'Fashion Finds',
    tag: 'Curated Outfits',
    description: 'Hand-picked wardrobe essentials, accessories & outfits. All under ₹999–₹2999 and available on Amazon Prime.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=70',
    cta: 'Browse Fashion',
  },
  {
    href: '/home-decor',
    label: 'Home Decor',
    tag: 'Room Inspo',
    description: 'Aesthetic room setups, décor finds & finishing touches. Transform your space for under ₹2000.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=70',
    cta: 'Browse Decor',
  },
];

export default async function HomePage() {
  const allPosts = await getPosts({ max: 12 }).catch(() => []);
  const featured = allPosts.filter(p => p.featured).slice(0, 6);
  const display  = featured.length ? featured : allPosts.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>

        {/* ══ HERO — Split layout, cream + green ══ */}
        <section className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-2">

          {/* Left — cream, text */}
          <div className="bg-ripple flex flex-col justify-center px-8 md:px-14 lg:px-20
            pt-32 pb-20 md:pt-0 md:pb-0 relative z-10">
            <div className="max-w-lg">
              <div className="eyebrow mb-6">
                <span className="eyebrow-line" />
                <span className="eyebrow-text">Curated for Taste</span>
              </div>

              <h1 className="font-serif font-300 text-ink mb-6 text-balance"
                style={{ fontSize:'clamp(3rem,6vw,5.5rem)', lineHeight:'.93', letterSpacing:'-0.025em' }}>
                <span className="block">Discover</span>
                <span className="block font-italic text-green">Trending</span>
                <span className="block">Finds.</span>
              </h1>

              <p className="font-sans text-base font-300 text-ink-muted leading-relaxed mb-10 max-w-sm">
                Handpicked Amazon fashion & home décor finds you'll love —
                curated weekly for aesthetic obsessives.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/fashion" className="btn-primary">
                  Explore Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
                <Link href="/home-decor" className="btn-outline-green">
                  Home Decor
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-ink/8">
                {[
                  { v: '200+', l: 'Products' },
                  { v: '50+',  l: 'Posts' },
                  { v: '100%', l: 'Amazon Verified' },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <p className="font-serif text-2xl text-green font-300"
                      style={{ letterSpacing: '-0.01em' }}>{v}</p>
                    <p className="font-sans text-[10px] font-300 text-ink-faint mt-0.5 tracking-wide uppercase">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — deep green, large image */}
          <div className="relative overflow-hidden min-h-[60vw] md:min-h-0"
            style={{ background: 'linear-gradient(135deg,#1E3D2C 0%,#2A4A38 100%)' }}>
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=70"
              alt="Fashion hero"
              fill priority
              className="object-cover object-center opacity-60 mix-blend-luminosity"
              sizes="50vw"
            />
            {/* Floating product card */}
            <div className="absolute bottom-10 left-8 right-8 md:right-auto md:max-w-[260px]">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 shadow-soft-xl">
                <p className="font-sans text-[9px] font-500 text-green tracking-widest uppercase mb-1">
                  Trending Now
                </p>
                <p className="font-serif text-base text-ink font-300" style={{ fontStyle:'italic' }}>
                  Quiet Luxury Accessories
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-sans text-xs font-500 text-ink-muted">From ₹449</span>
                  <span className="badge-toppick">Top Pick</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MARQUEE TICKER ══ */}
        <div className="bg-green py-3.5 overflow-hidden">
          <div className="marquee-wrapper">
            <div className="marquee-track gap-0">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                <span key={i} className="marquee-item flex items-center gap-4 px-6
                  font-sans text-xs font-400 tracking-widest uppercase text-cream-50/75 whitespace-nowrap">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-gold/60 inline-block" />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ CATEGORY CARDS ══ */}
        <section className="bg-ripple-right bg-cream section-pad">
          <div className="container-max">
            <div className="text-center mb-14">
              <div className="eyebrow justify-center mb-4">
                <span className="eyebrow-line" /><span className="eyebrow-text">Browse by Category</span><span className="eyebrow-line" />
              </div>
              <h2 className="heading-section text-ink" style={{ fontStyle:'italic' }}>
                What Are You{' '}
                <span className="text-green">Shopping For?</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {CATEGORIES.map(({ href, label, tag, description, image, cta }) => (
                <Link key={href} href={href}
                  className="group relative overflow-hidden rounded-4xl block" style={{ aspectRatio:'4/3' }}>
                  <Image src={image} alt={label} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width:768px)100vw,50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="font-sans text-[9px] font-500 tracking-widest uppercase
                      bg-white/20 backdrop-blur-sm text-white border border-white/20
                      rounded-pill px-3 py-1">
                      {tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <h3 className="font-serif text-3xl md:text-4xl text-white font-300 mb-2"
                      style={{ fontStyle:'italic', letterSpacing:'-0.01em' }}>
                      {label}
                    </h3>
                    <p className="font-sans text-sm font-300 text-white/70 mb-5 max-w-xs leading-relaxed">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-sans text-sm font-400 group-hover:gap-3 transition-all">
                      {cta}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TRENDING POSTS ══ */}
        <section className="bg-cream-300 section-pad">
          <div className="container-max">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
              <div>
                <div className="eyebrow mb-3">
                  <span className="eyebrow-line" /><span className="eyebrow-text">Handpicked Weekly</span>
                </div>
                <h2 className="heading-section text-ink" style={{ fontStyle:'italic' }}>
                  Trending <span className="text-green">Finds</span>
                </h2>
                <div className="divider-gold" />
              </div>
              <div className="flex gap-3">
                <Link href="/fashion"    className="btn-ghost text-[12px] py-2">Fashion →</Link>
                <Link href="/home-decor" className="btn-ghost text-[12px] py-2">Decor →</Link>
              </div>
            </div>

            {display.length > 0 ? (
              <div className="masonry">
                {display.map((post, i) => (
                  <PostCard key={post.id} post={post} priority={i < 2} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="font-serif text-2xl text-ink/30 font-300" style={{ fontStyle:'italic' }}>
                  New finds coming soon
                </p>
                <p className="font-sans text-sm font-300 text-ink-faint mt-2">
                  Add posts via the admin panel
                </p>
              </div>
            )}

            {display.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/fashion" className="btn-outline-green px-10 py-4">
                  View All Finds →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="section-pad" style={{ background:'linear-gradient(135deg,#1E3D2C 0%,#2A4A38 100%)' }}>
          <div className="container-max">
            <div className="text-center mb-14">
              <div className="eyebrow justify-center mb-4">
                <span className="w-6 h-px bg-gold/50 inline-block" />
                <span className="font-sans text-[10px] font-500 tracking-[0.22em] uppercase text-gold/80">Simple Process</span>
                <span className="w-6 h-px bg-gold/50 inline-block" />
              </div>
              <h2 className="font-serif text-cream-50 font-300 text-balance"
                style={{ fontSize:'clamp(2rem,4vw,3.5rem)', lineHeight:1, letterSpacing:'-0.015em', fontStyle:'italic' }}>
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n:'01', t:'We Find It',   d:'Our team scours Amazon daily for the most aesthetic, best-reviewed, best-value finds.' },
                { n:'02', t:'We Verify It', d:'Every product is checked for genuine ratings and quality before making our list.' },
                { n:'03', t:'You Buy It',   d:'Click "View on Amazon" and shop directly. Prime delivery. Easy returns.' },
              ].map(({ n, t, d }) => (
                <div key={n} className="text-center">
                  <div className="font-display text-6xl font-300 text-gold/20 leading-none mb-4">{n}</div>
                  <h3 className="font-serif text-xl text-cream-50 font-300 mb-3" style={{ fontStyle:'italic' }}>{t}</h3>
                  <p className="font-sans text-sm font-300 text-cream-50/55 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ NEWSLETTER ══ */}
        <section className="bg-ripple section-pad">
          <div className="container-max">
            <div className="max-w-xl mx-auto text-center">
              <div className="eyebrow justify-center mb-4">
                <span className="eyebrow-line" /><span className="eyebrow-text">Stay Ahead</span><span className="eyebrow-line" />
              </div>
              <h2 className="heading-section text-ink mb-4" style={{ fontStyle:'italic' }}>
                New finds,<br />every week.
              </h2>
              <p className="body-md mb-8">
                Get the latest curated Amazon finds before they blow up on Pinterest.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="your@email.com"
                  className="input-cream flex-1 text-center sm:text-left"
                  suppressHydrationWarning />
                <button suppressHydrationWarning className="btn-primary px-7">Subscribe Free</button>
              </div>
              <p className="font-sans text-xs font-300 text-ink-faint mt-4">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
