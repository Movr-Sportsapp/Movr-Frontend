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
      </div>
      </div>
    </>
  );
}
