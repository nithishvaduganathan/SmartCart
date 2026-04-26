import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
    });

    const [registerForm, setRegisterForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleLoginChange = (field, value) => {
        setLoginForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleRegisterChange = (field, value) => {
        setRegisterForm(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(loginForm.username, loginForm.password);
            onClose();
            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.detail || 'Unable to sign in with those credentials.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (registerForm.password !== registerForm.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await register(
                registerForm.username,
                registerForm.email,
                registerForm.password
            );
            onClose();
            navigate('/dashboard');
        } catch (err) {
            const data = err.response?.data;
            setError(data?.error || data?.username?.[0] || 'Unable to create your account.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setLoginForm({ username: '', password: '' });
        setRegisterForm({ username: '', email: '', password: '', confirmPassword: '' });
        setError('');
        setIsLogin(true);
        onClose();
    };

    // Redirect if already logged in
    if (user && isOpen) {
        handleClose();
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Content */}
                        <div className="p-8">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {isLogin ? 'Welcome Back' : 'Join SmartCart'}
                                </h2>
                                <p className="text-gray-600">
                                    {isLogin
                                        ? 'Sign in to your account to continue'
                                        : 'Create an account to start shopping'}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Login Form */}
                            {isLogin ? (
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={loginForm.username}
                                            onChange={(e) => handleLoginChange('username', e.target.value)}
                                            placeholder="Enter your username"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) => handleLoginChange('password', e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </motion.button>
                                </form>
                            ) : (
                                /* Register Form */
                                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={registerForm.username}
                                            onChange={(e) => handleRegisterChange('username', e.target.value)}
                                            placeholder="Choose a username"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={registerForm.email}
                                            onChange={(e) => handleRegisterChange('email', e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={registerForm.password}
                                            onChange={(e) => handleRegisterChange('password', e.target.value)}
                                            placeholder="Create a password"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={registerForm.confirmPassword}
                                            onChange={(e) => handleRegisterChange('confirmPassword', e.target.value)}
                                            placeholder="Confirm your password"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Creating account...' : 'Create Account'}
                                    </motion.button>
                                </form>
                            )}

                            {/* Toggle Form */}
                            <div className="text-center mt-6">
                                <p className="text-gray-600 text-sm">
                                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError('');
                                        }}
                                        className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                                    >
                                        {isLogin ? 'Sign up' : 'Sign in'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
