import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold text-white">
                                SmartCart
                            </span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="text-zinc-300 hover:text-white transition-colors relative">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/dashboard" className="text-zinc-300 hover:text-white flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span className="hidden lg:block">Dashboard</span>
                                </Link>
                                <Link to="/profile" className="text-zinc-300 hover:text-white flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    <span className="hidden md:block">{user.username}</span>
                                </Link>
                                <button onClick={handleLogout} className="text-zinc-400 hover:text-red-400 transition-colors">
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="text-zinc-300 hover:text-white px-3 py-2 text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
