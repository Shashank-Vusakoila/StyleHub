'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import AdminModal from './admin/AdminModal';

export default function Footer() {
  const [adminOpen, setAdminOpen] = useState(false);
  const clicksRef = useRef(0);
  const timerRef  = useRef(null);

  function handleCopyrightClick() {
    clicksRef.current += 1;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { clicksRef.current = 0; }, 2000);
    if (clicksRef.current >= 5) {
      clicksRef.current = 0;
      setAdminOpen(true);
    }
  }

  return (
    <>
      <footer className="bg-cream-300 border-t border-ink/6">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex flex-col leading-none mb-5 w-fit">
                <span className="font-display text-3xl text-ink font-400"
                  style={{ fontStyle: 'italic' }}>StyleHub</span>
                <span className="font-sans text-[7.5px] tracking-[0.3em] text-green font-500 uppercase -mt-1">Finds</span>
              </Link>
              <p className="font-sans text-sm font-300 text-ink-muted leading-relaxed max-w-[200px]">
                Curated Amazon fashion & home decor finds. Updated weekly.
              </p>
            </div>

            <div>
              <p className="font-sans text-[10px] font-500 tracking-[0.18em] uppercase text-green mb-5">Explore</p>
              {[
                { href: '/',           label: 'Home'       },
                { href: '/fashion',    label: 'Fashion'    },
                { href: '/home-decor', label: 'Home Decor' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="block font-sans text-sm font-300 text-ink-muted hover:text-ink transition-colors mb-3">
                  {label}
                </Link>
              ))}
            </div>

            <div>
              <p className="font-sans text-[10px] font-500 tracking-[0.18em] uppercase text-green mb-5">Follow</p>
              {['Pinterest', 'Instagram', 'Amazon Storefront'].map(l => (
                <a key={l} href="#"
                  className="block font-sans text-sm font-300 text-ink-muted hover:text-green transition-colors mb-3">
                  {l}
                </a>
              ))}
            </div>

            <div>
              <p className="font-sans text-[10px] font-500 tracking-[0.18em] uppercase text-green mb-5">Legal</p>
              {['Privacy Policy', 'Terms of Use', 'Sitemap'].map(l => (
                <a key={l} href="#"
                  className="block font-sans text-sm font-300 text-ink-muted hover:text-ink transition-colors mb-3">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-ink/6 mb-8" />

          {/* Affiliate disclaimer */}
          <div className="bg-white/50 rounded-2xl px-6 py-4 mb-8">
            <p className="font-sans text-xs font-300 text-ink-muted text-center leading-relaxed">
              <span className="text-green/60 font-500">Affiliate Disclosure: </span>
              As an Amazon Associate, we earn from qualifying purchases.
              Prices and availability are subject to change at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Hidden admin trigger — 5 clicks */}
            <p
              className="font-sans text-xs font-300 text-ink-faint cursor-default select-none"
              onClick={handleCopyrightClick}
              title="">
              <span suppressHydrationWarning>© {new Date().getFullYear()} StyleHub Decors. All rights reserved.</span>
            </p>
            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Sitemap'].map(t => (
                <a key={t} href="#"
                  className="font-sans text-xs font-300 text-ink-faint hover:text-ink-muted transition-colors">
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {adminOpen && <AdminModal onClose={() => setAdminOpen(false)} />}
    </>
  );
}
