'use client';
import Image from 'next/image';
import { trackClick } from '../lib/firestore';

const BADGE_STYLE = {
  'Amazon\'s Choice': 'bg-amber-50 text-amber-700 border-amber-200',
  'Best Seller':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Trending':         'bg-rose-50 text-rose-700 border-rose-200',
  'Top Pick':         'bg-green/8 text-green border-green/15',
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < full ? 'text-amber-400' : 'text-ink/10'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, postId, postSlug, index }) {
  const discountPct = product.originalPrice && product.price
    ? Math.round((1 - parseFloat(product.price.replace(/[₹,]/g, '')) / parseFloat(product.originalPrice.replace(/[₹,]/g, ''))) * 100)
    : null;

  const badge = product.badge || '';
  const badgeStyle = BADGE_STYLE[badge] || 'bg-green/8 text-green border-green/15';

  async function handleClick() {
    try {
      await trackClick({
        postId, postSlug,
        productId: product.id,
        productName: product.name,
        affiliateLink: product.affiliateLink,
      });
    } catch (_) {}
    window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
  }

  return (
    <article id={`product-${product.id}`}
      className="group bg-white rounded-4xl overflow-hidden shadow-lift border border-ink/4
        transition-all duration-500 hover:shadow-lift-lg hover:-translate-y-1">

      {/* Index + layout: image left, content right */}
      <div className="flex flex-col md:flex-row">

        {/* Image */}
        <div className="relative md:w-[45%] shrink-0 overflow-hidden img-zoom">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="w-full h-64 md:h-full object-cover"
              sizes="(max-width:768px)100vw,45vw"
            />
          ) : (
            <div className="w-full h-64 md:h-full min-h-[280px] bg-cream-300 flex items-center justify-center">
              <svg className="w-14 h-14 text-green/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {discountPct > 0 && (
            <div className="absolute top-3 left-3">
              <span className="font-sans text-[10px] font-600 bg-rose-500 text-white rounded-pill px-2.5 py-1">
                {discountPct}% OFF
              </span>
            </div>
          )}

          {/* Index number */}
          <div className="absolute bottom-3 left-3">
            <span className="font-display text-4xl font-300 text-white/20 leading-none">
              {String(index).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col">

          {/* Top: badge + highlight */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            {badge && (
              <span className={`font-sans text-[9.5px] font-500 tracking-wider uppercase px-2.5 py-1 rounded-pill border ${badgeStyle}`}>
                {badge}
              </span>
            )}
            {product.highlight && (
              <span className="font-sans text-[10px] font-300 text-ink-faint">
                {product.highlight}
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="font-serif text-xl md:text-2xl text-ink font-300 mb-3 leading-snug"
            style={{ letterSpacing: '-0.01em' }}>
            {product.name}
          </h2>

          {/* Stars + reviews */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Stars rating={product.rating} />
              <span className="font-sans text-xs font-500 text-amber-600">{product.rating.toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="font-sans text-xs font-300 text-ink-faint">
                  ({product.reviewCount.toLocaleString('en-IN')} reviews)
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4 py-3 px-4 bg-cream-200 rounded-2xl">
            <span className="font-serif text-2xl text-green font-300" style={{ letterSpacing: '-0.01em' }}>
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="font-sans text-sm text-ink-faint font-300 line-through">
                {product.originalPrice}
              </span>
            )}
            {discountPct > 0 && (
              <span className="ml-auto font-sans text-[10px] font-500 text-rose-600">
                Save {discountPct}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-sans text-sm font-300 text-ink-muted leading-relaxed mb-5 flex-1">
            {product.description}
          </p>

          {/* Features */}
          {product.features?.length > 0 && (
            <ul className="mb-6 space-y-2">
              {product.features.filter(Boolean).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 font-sans text-xs font-300 text-ink-muted">
                  <span className="w-1 h-1 rounded-full bg-green/60 mt-1.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* CTA — the money button */}
          <button suppressHydrationWarning onClick={handleClick}
            className="group/btn w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl
              bg-green text-cream-50 font-sans text-sm font-500 tracking-wide
              shadow-green-md hover:bg-green-medium hover:shadow-green-lg hover:-translate-y-0.5
              active:scale-[0.98] transition-all duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            View on Amazon
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>

          <p className="text-center mt-2 font-sans text-[9.5px] font-300 text-ink-faint">
            Opens Amazon.in · Affiliate link
          </p>
        </div>
      </div>
    </article>
  );
}
