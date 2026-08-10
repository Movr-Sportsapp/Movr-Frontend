import { Routes, Route } from 'react-router-dom';
import HealthCheck from './pages/HealthCheck';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import PostEvent from './pages/PostEvent';
import './App.css';
import { RequireAuth, RequireGuest } from './routes/routeGuards';


function App() {

  return (
    <div> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<RequireGuest> <SignUpPage /></RequireGuest>}/>
        <Route path="/login" element={<RequireGuest><LoginPage /></RequireGuest>} />
        <Route path="/post" element={<RequireAuth><PostEvent /></RequireAuth>} />
        <Route path="/healthcheck" element={<HealthCheck />} />  
      </Routes>
    </div>
  )
}

export default App
