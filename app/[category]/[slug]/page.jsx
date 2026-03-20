import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import PostCard from '../../../components/PostCard';
import { getPostBySlug, getProducts, getPosts } from '../../../lib/firestore';
import ViewTracker from '../../../components/ViewTracker';

export const revalidate = 3600; // 1 hour cache

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function MoneyPage({ params }) {
  const { category, slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post || post.category !== category) notFound();

  const [products, relatedRaw] = await Promise.all([
    getProducts(post.id).catch(() => []),
    getPosts({ category: post.category, max: 4 }).catch(() => []),
  ]);
  const related = relatedRaw.filter(p => p.id !== post.id).slice(0, 3);

  const catLabel = post.category === 'fashion' ? 'Fashion' : 'Home Decor';
  const catPath  = post.category === 'fashion' ? '/fashion' : '/home-decor';

  return (
    <>
      <Navbar />
      <ViewTracker postId={post.id} postSlug={post.slug} />
      <main>

        {/* ── HERO ── */}
        <section className="relative min-h-[65vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {post.coverImage ? (
              <Image src={post.coverImage} alt={post.title} fill priority
                className="object-cover" sizes="100vw" />
            ) : (
              <div className="w-full h-full bg-cream-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto px-5 md:px-10 pb-14 pt-32">
            <nav className="flex items-center gap-2 font-sans text-xs font-300 text-white/50 mb-5">
              <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
              <span>/</span>
              <Link href={catPath} className="hover:text-white/80 transition-colors">{catLabel}</Link>
              <span>/</span>
              <span className="text-white/70 truncate max-w-[200px]">{post.title}</span>
            </nav>

            <div className="flex flex-wrap gap-2 mb-5">
              <span className="font-sans text-[9px] font-500 tracking-widest uppercase
                bg-green text-cream-50 rounded-pill px-3 py-1">{catLabel}</span>
              {post.tags?.map(t => (
                <span key={t} className="font-sans text-[9px] font-300 tracking-wider uppercase
                  border border-white/20 text-white/60 rounded-pill px-3 py-1">
                  #{t}
                </span>
              ))}
            </div>

            <h1 className="font-serif text-white font-300 text-balance mb-5"
              style={{ fontSize:'clamp(1.8rem,4.5vw,4rem)', lineHeight:1.0, letterSpacing:'-0.02em', fontStyle:'italic' }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="font-sans text-base font-300 text-white/65 max-w-2xl leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-5">
              {[
                { icon: '🛍️', t: `${products.length} Amazon finds` },
                { icon: '⚡', t: 'Prime Eligible' },
                { icon: '🇮🇳', t: 'Ships Across India' },
              ].map(({ icon, t }) => (
                <div key={t} className="flex items-center gap-2 font-sans text-sm font-300 text-white/55">
                  <span>{icon}</span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INTRO + TABLE OF CONTENTS ── */}
        {(post.intro || products.length > 0) && (
          <div className="bg-ripple border-b border-ink/5">
            <div className="max-w-5xl mx-auto px-5 md:px-10 py-12">
              {post.intro && (
                <p className="font-sans text-base font-300 text-ink-muted leading-relaxed mb-8 max-w-3xl"
                  style={{ lineHeight: 1.85 }}>
                  {post.intro}
                </p>
              )}

              {products.length > 0 && (
                <div className="bg-white rounded-3xl border border-ink/5 overflow-hidden max-w-lg shadow-soft">
                  <div className="px-5 py-3 border-b border-ink/5">
                    <p className="font-sans text-[9.5px] font-500 tracking-widest uppercase text-green">
                      In This Post
                    </p>
                  </div>
                  {products.map((p, i) => (
                    <a key={p.id} href={`#product-${p.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-cream-200 transition-colors
                        border-b border-ink/4 last:border-0 group">
                      <span className="font-display text-lg text-green/30 font-300 w-7 shrink-0"
                        style={{ fontStyle:'italic' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-sm font-300 text-ink-muted group-hover:text-ink
                        transition-colors flex-1 leading-snug">
                        {p.name}
                      </span>
                      <span className="font-sans text-sm font-400 text-green shrink-0">{p.price}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        <section className="bg-cream section-pad">
          <div className="max-w-5xl mx-auto px-5 md:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="eyebrow mb-3">
                  <span className="eyebrow-line" /><span className="eyebrow-text">Shoppable Finds</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-ink font-300"
                  style={{ fontStyle:'italic', letterSpacing:'-0.01em' }}>
                  Everything in This Post
                </h2>
                <div className="divider-gold" />
              </div>
              <a href="https://amazon.in" target="_blank" rel="noopener noreferrer"
                className="btn-ghost text-sm w-fit">
                Amazon Storefront →
              </a>
            </div>

            <div className="space-y-8">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  postId={post.id}
                  postSlug={post.slug}
                  index={i + 1}
                />
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-16 text-center">
                <p className="font-serif text-xl text-ink/30 font-300" style={{ fontStyle:'italic' }}>
                  Products coming soon
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── VERDICT / ENDING ── */}
        {post.ending && (
          <div className="bg-cream-300 border-y border-ink/5">
            <div className="max-w-5xl mx-auto px-5 md:px-10 py-12">
              <div className="bg-white rounded-3xl p-7 md:p-10 shadow-soft max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-serif text-xl text-ink font-300" style={{ fontStyle:'italic' }}>
                    Our Verdict
                  </h3>
                </div>
                <p className="font-sans text-base font-300 text-ink-muted leading-relaxed" style={{ lineHeight:1.85 }}>
                  {post.ending}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RELATED ── */}
        {related.length > 0 && (
          <section className="bg-ripple section-pad">
            <div className="container-max">
              <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
                <div>
                  <div className="eyebrow mb-3">
                    <span className="eyebrow-line" /><span className="eyebrow-text">More to Explore</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-ink font-300"
                    style={{ fontStyle:'italic', letterSpacing:'-0.01em' }}>
                    Related <span className="text-green">Finds</span>
                  </h2>
                </div>
                <Link href={catPath} className="btn-outline-green text-sm">
                  All {catLabel} →
                </Link>
              </div>
              <div className="masonry">
                {related.map(r => <PostCard key={r.id} post={r} />)}
              </div>
            </div>
          </section>
        )}

        {/* Affiliate disclaimer */}
        <div className="bg-cream-200 py-5 border-t border-ink/5">
          <p className="font-sans text-xs font-300 text-ink-faint text-center px-5 leading-relaxed">
            ✦ As an Amazon Associate, we earn from qualifying purchases. Prices may vary. ✦
          </p>
        </div>

      </main>
      <Footer />
    </>
  );
}
