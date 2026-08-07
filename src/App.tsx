import { Routes, Route } from 'react-router-dom';
import HealthCheck from './pages/HealthCheck';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import './App.css';


function App() {

  return (
    <div> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/api/health" element={<HealthCheck />} />  
      </Routes>
    </div>
  )
}

export default App
