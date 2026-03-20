'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',           label: 'Home'       },
  { href: '/fashion',    label: 'Fashion'    },
  { href: '/home-decor', label: 'Home Decor' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500
          ${scrolled
            ? 'glass border-b border-ink/6 shadow-soft py-3'
            : 'bg-transparent py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl md:text-[1.7rem] text-ink font-400"
              style={{ fontStyle: 'italic', letterSpacing: '-0.01em' }}>
              StyleHub
            </span>
            <span className="font-sans text-[7.5px] tracking-[0.3em] text-green font-500 uppercase -mt-1">
              Decors
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className={`font-sans text-sm font-300 transition-colors duration-200 relative pb-px
                    ${active ? 'text-green' : 'text-ink-muted hover:text-ink'}`}>
                  {label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-px rounded-full bg-green/60" />}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://amazon.in" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-xs py-2.5 px-5 gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              Shop Amazon
            </a>
          </div>

          {/* Hamburger */}
          <button suppressHydrationWarning onClick={() => setOpen(v => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-ink/5 transition-colors">
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-px bg-ink rounded-full transition-all duration-300
                ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
              <span className={`block h-px bg-ink rounded-full transition-all duration-300
                ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-ink rounded-full transition-all duration-300
                ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-400
        ${open ? 'visible' : 'invisible pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-cream/90 backdrop-blur-xl
          transition-opacity duration-400 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)} />
        <nav className={`absolute top-0 right-0 h-full w-72 bg-cream shadow-soft-xl
          flex flex-col justify-center px-10 gap-8 border-l border-ink/6
          transition-transform duration-400 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <button suppressHydrationWarning onClick={() => setOpen(false)}
            className="absolute top-5 right-5 p-2 text-ink-muted hover:text-ink">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href}
              className="font-serif text-3xl text-ink font-300 hover:text-green transition-colors"
              style={{ fontStyle: 'italic' }}>
              {label}
            </Link>
          ))}
          <a href="https://amazon.in" target="_blank" rel="noopener noreferrer"
            className="btn-primary w-fit mt-2">
            Shop Amazon
          </a>
        </nav>
      </div>
    </>
  );
}
