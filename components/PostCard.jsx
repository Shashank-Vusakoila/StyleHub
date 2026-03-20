import Link from 'next/link';
import Image from 'next/image';

export default function PostCard({ post, priority = false }) {
  const href = `/${post.category}/${post.slug}`;

  return (
    <div className="masonry-item">
      <Link href={href} className="group block">
        <article className="bg-white rounded-3xl overflow-hidden shadow-lift transition-all duration-500 hover:shadow-lift-lg hover:-translate-y-1.5">

          {/* Image */}
          <div className="relative overflow-hidden img-zoom">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                width={600}
                height={750}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                className="w-full object-cover"
                style={{ display: 'block' }}
                sizes="(max-width:480px)100vw,(max-width:1024px)50vw,33vw"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-cream-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-green/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {post.category && (
                <span className="label-green text-[9px]">
                  {post.category === 'fashion' ? '✦ Fashion' : '✦ Home Decor'}
                </span>
              )}
            </div>
            {post.featured && (
              <div className="absolute top-3 right-3">
                <span className="badge-toppick">Top Pick</span>
              </div>
            )}

            {/* Product count hover badge */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <span className="font-sans text-[10px] font-500 text-white bg-ink/50 backdrop-blur-sm rounded-pill px-2.5 py-1">
                {post.productCount || 0} finds
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pt-4 pb-5">
            <p className="font-sans text-[10px] font-500 tracking-[0.15em] text-green uppercase mb-2">
              {post.category === 'fashion' ? 'Fashion' : 'Home Decor'}
            </p>
            <h3 className="heading-card text-ink mb-2 text-balance"
              style={{ fontStyle: 'italic', fontWeight: 300 }}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="font-sans text-xs font-300 text-ink-muted leading-relaxed line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {post.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="font-sans text-[9px] font-300 text-ink-faint tracking-wide">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="font-sans text-[10px] font-400 text-green flex items-center gap-1 group-hover:gap-2 transition-all">
                Shop now
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
}
