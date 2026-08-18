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

export default function InfoSection() {
    return (
      <section className="pt-24 pb-15 px-6 border-t border-divider">
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
                  <span className="font-display font-black text-5xl text-lime leading-none">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-bold uppercase text-xl tracking-wide text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}