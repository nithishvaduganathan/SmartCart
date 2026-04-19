import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/landingpage';
import ProductPage from './pages/ProductPage';
// Placholders for other pages
const Login = () => <div className="text-white text-center mt-20">Login Page</div>;
const Cart = () => <div className="text-white text-center mt-20">Cart Page</div>;

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
                <Route path="/cart" element={<Cart />} />
                <Route path="/product" element={<ProductPage />} />             
                 </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;