export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col leading-none items-center">
          <span className="font-display text-4xl text-ink/20 font-400"
            style={{ fontStyle: 'italic' }}>StyleHub</span>
          <span className="font-sans text-[8px] tracking-[0.3em] text-green/30 font-500 uppercase">Finds</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i}
              className="w-1.5 h-1.5 rounded-full bg-green/30 animate-bounce"
              style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
