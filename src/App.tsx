import { Routes, Route } from "react-router-dom";
import HealthCheck from "./pages/HealthCheck";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/SignUp";
import PostEvent from "./pages/PostEvent";
import Navbar from "./components/UI/Navbar";
import BottomNav from "./components/UI/BottomNav";
import "./App.css";
import { RequireAuth, RequireGuest } from "./routes/routeGuards";
import EventsListPage from "./pages/EventsListPage";
import  EventDetailsPage from "./pages/EventDetailsPage";
import UpdateUser from "./pages/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";
import MessagePage from "./pages/MessagePage";

function App() {
  return (
    <div>
      <Navbar />
        <ScrollToTop />
      <div className="bg-black mt-16 pb-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <RequireGuest>
              {" "}
              <SignUpPage />
            </RequireGuest>
          }
        />
        <Route
          path="/login"
          element={
            <RequireGuest>
              <LoginPage />
            </RequireGuest>
          }
        />
        <Route
          path="/createevent"
          element={
            <RequireAuth>
              <PostEvent />
            </RequireAuth>
          }
        />
        <Route
          path="/events"
          element={
            <RequireAuth>
              <EventsListPage />
            </RequireAuth>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <RequireAuth>
              <EventDetailsPage />
            </RequireAuth>
          }
          />
           <Route
          path="/me"
          element={
            <RequireAuth>
              <UpdateUser />
            </RequireAuth>
          }
          />
           <Route
          path="/messages"
          element={
            <RequireAuth>
              <MessagePage />
            </RequireAuth>
          }
          />
        <Route path="/healthcheck" element={<HealthCheck />} />
      </Routes>
      <BottomNav />
      </div>
    </div>
  );
}

export default App;
