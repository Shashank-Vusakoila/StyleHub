'use client';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <main className="min-h-screen bg-ripple flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <h2 className="font-serif text-3xl text-ink font-300 mb-3" style={{ fontStyle: 'italic' }}>
          Something went wrong
        </h2>
        <p className="font-sans text-sm font-300 text-ink-muted mb-8">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button suppressHydrationWarning onClick={reset} className="btn-primary">Try Again</button>
          <Link href="/" className="btn-outline-green">Go Home</Link>
        </div>
      </div>
    </main>
  );
}
