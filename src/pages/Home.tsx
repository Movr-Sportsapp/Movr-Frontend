const HOW_IT_WORKS = [
  {
    num: '01',
    icon: '👤',
    title: 'Create Your Profile',
    body: "Sign up, tell us which sports you love, and set your experience level. Two minutes — you're in.",
  },
  {
    num: '02',
    icon: '🔍',
    title: 'Find or Post',
    body: "Search by sport, city, or date. Find something that fits, or be the host and invite others to join you.",
  },
  {
    num: '03',
    icon: '🤝',
    title: 'Show Up & Move',
    body: "Join the activity, meet your new training partners, and come back next week for more.",
  },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-bg">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1800&h=1200&fit=crop&auto=format')",
          }}
        />
        {/* Multi-layer overlay for the kinetic dark feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/50 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/40 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime/10 border border-lime/20 mb-12">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span className="text-lime text-xs font-semibold tracking-widest uppercase">
              Sports community · Berlin and beyond
            </span>
          </div>

          <h1 className="font-display font-black uppercase leading-[0.88] text-white mb-6">
            <span className="block" style={{ fontSize: 'clamp(3rem,10vw,8rem)', letterSpacing: '-0.02em' }}>
              FIND YOUR
            </span>
            <span
              className="block"
              style={{
                fontSize: 'clamp(3rem,10vw,8rem)',
                letterSpacing: '-0.02em',
                WebkitTextStroke: '2px #C8FA5F',
                color: 'transparent',
              }}
            >
              PEOPLE.
            </span>
            <span className="block text-lime" style={{ fontSize: 'clamp(3rem,10vw,8rem)', letterSpacing: '-0.02em' }}>
              MOVE TOGETHER.
            </span>
          </h1>

          <p className="text-lg text-white/55 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Join or host sports activities in your city. Run with strangers.
            Play with friends. Find a community that moves at your pace.
          </p>
          </div>
          </section>
          {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 border-t border-divider">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-lime text-xs font-semibold tracking-widest uppercase mb-3">How it works</p>
            <h2 className="font-display font-black uppercase leading-none text-white"
              style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.02em' }}>
              THREE STEPS.<br />THAT'S IT.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-divider rounded-2xl overflow-hidden">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="bg-surface p-8 md:p-10">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="font-display font-black text-5xl text-lime/15 leading-none">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold uppercase text-xl tracking-wide text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-8 px-6 border-t border-divider">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display font-black text-xl tracking-widest uppercase text-white">MOVR</span>
          <p className="text-muted text-xs">© 2026 MOVR. Move together.</p>
        </div>
      </footer>
          </div>
    )
};