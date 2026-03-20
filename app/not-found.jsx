import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] bg-ripple flex items-center justify-center px-5">
        <div className="text-center max-w-lg">
          <p className="font-display text-[10rem] font-300 text-green/10 leading-none select-none mb-0"
            style={{ letterSpacing: '-0.04em' }}>
            404
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink font-300 -mt-6 mb-4"
            style={{ fontStyle: 'italic', letterSpacing: '-0.01em' }}>
            Page not found
          </h1>
          <p className="font-sans text-sm font-300 text-ink-muted leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-primary">← Back to Home</Link>
            <Link href="/fashion" className="btn-outline-green">Browse Fashion</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
