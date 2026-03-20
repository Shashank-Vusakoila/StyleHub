import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PostCard from '../../components/PostCard';
import { getPosts } from '../../lib/firestore';

export const revalidate = 3600; // 1 hour cache

export const metadata = {
  title: 'Home Decor Finds',
  description: 'Aesthetic room setups & Amazon décor finds. Pinterest-worthy spaces built for under ₹2000.',
};

export default async function HomeDecorPage() {
  const posts = await getPosts({ category: 'home-decor' }).catch(() => []);

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className="relative min-h-[55vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=60"
              alt="Home Decor" fill priority
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#1E3D2C 0%,#2A4A38 100%)', opacity: 0.88 }} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pb-14 pt-32 w-full">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-5 h-px bg-gold/60 inline-block" />
              <span className="font-sans text-[10px] font-500 tracking-[0.2em] uppercase text-gold/80">Category</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="font-serif font-300 text-cream-50 mb-4"
                  style={{ fontSize: 'clamp(2.5rem,7vw,5.5rem)', lineHeight: 0.95, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
                  Home
                  <br />
                  <span className="text-gold">Decor</span>
                </h1>
                <p className="font-sans text-sm font-300 text-cream-50/60 max-w-md leading-relaxed">
                  Aesthetic room setups, furniture & finishing touches — all shoppable on Amazon India.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-pill px-5 py-2.5 w-fit">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-sans text-xs font-300 text-cream-50/70">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── GRID ── */}
        <section className="bg-ripple min-h-[50vh] py-14 md:py-20 px-5 md:px-10">
          <div className="max-w-7xl mx-auto">
            {posts.length > 0 ? (
              <div className="masonry">
                {posts.map((post, i) => (
                  <PostCard key={post.id} post={post} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center">
                <p className="font-serif text-3xl text-ink/25 font-300" style={{ fontStyle: 'italic' }}>
                  New home decor finds coming soon
                </p>
                <p className="font-sans text-sm font-300 text-ink-faint mt-3">
                  Posts will appear here once added via admin
                </p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
