import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/landingpage';
import Login from './pages/login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

function App() {
  return ( 
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white font-sans">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
