import { useAuth } from "../context/AuthContext";

interface HeroSectionProps {
    onSignup: () => void;
    onLogin: () => void;
    onPostEvent: () => void;
}

export default function HeroSection({ onSignup, onLogin, onPostEvent}: HeroSectionProps) {

    const { user } = useAuth();

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1800&h=1200&fit=crop&auto=format')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-bg/80 via-bg/50 to-bg" />
      <div className="absolute inset-0 bg-linear-to-r from-bg/40 to-transparent" />

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
          Join or host sports activities in your city. Run with new friends.
          Play with neighbors. Find a community that moves at your pace.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {user ? (
            <button
              onClick={onPostEvent}
              className="px-8 py-4 rounded-xl bg-lime text-bg font-bold text-base hover:bg-lime/90 active:scale-95 transition-all duration-150 shadow-lg shadow-lime/20"
            >
              Post an event →
            </button>
          ) : (
            <>
              <button
                onClick={onSignup}
                className="px-8 py-4 rounded-xl bg-lime text-bg font-bold text-base hover:bg-lime/90 active:scale-95 transition-all duration-150 shadow-lg shadow-lime/20"
              >
                Join MOVR
              </button>
              <button
                onClick={onLogin}
                className="px-8 py-4 rounded-xl border border-white/15 text-white font-medium text-base hover:bg-white/5 active:scale-95 transition-all duration-150"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </section>
    );
}