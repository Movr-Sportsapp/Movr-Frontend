import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import UpcomingEvents from "../components/UpcomingEventsSection";

export default function HomePage() {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  if (loading) return null;

  return (
    <>
      <HeroSection
        onSignup={() => {
          navigate("/signup");
        }}
        onLogin={() => {
          navigate("/login");
        }}
        onPostEvent={() => {
          navigate("/createevent");
        }}
      />

      {!user && <InfoSection />}

      <div className="bg-black">
        <div className="min-h-screen bg-bg">
          <UpcomingEvents />

          <footer className="py-8 px-6 border-t border-divider">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span className="font-display font-black text-xl tracking-widest uppercase text-white">
                MOVR
              </span>
              <p className="text-muted text-xs">© 2026 MOVR. Move together.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
