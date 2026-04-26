import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Star, ShoppingCart, Heart, Package, Award, Truck, Shield, Clock, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import ProductCard from '../components/ProductCard';

const LandingPage = () => {
    const { api, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const features = [
        {
            icon: '🤖',
            title: 'AI-Powered Recommendations',
            description: 'Smart suggestions tailored to your preferences and shopping history',
        },
        {
            icon: '🎤',
            title: 'Voice Search',
            description: 'Search products using natural voice commands for faster browsing',
        },
        {
            icon: '⚡',
            title: 'Lightning-Fast Checkout',
            description: 'One-click purchasing with saved payment methods and addresses',
        },
        {
            icon: '📱',
            title: 'Mobile Optimized',
            description: 'Seamless shopping experience across all devices and platforms',
        },
        {
            icon: '🎁',
            title: 'Exclusive Deals',
            description: 'Early access to sales and member-only special offers',
        },
        {
            icon: '🚀',
            title: 'Fast Shipping',
            description: 'Express delivery options available for all orders',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Fashion Enthusiast',
            text: 'SmartCart has completely changed how I shop online. The recommendations are spot-on!',
            rating: 5,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        {
            name: 'Mike Chen',
            role: 'Tech Reviewer',
            text: 'The voice search feature is a game-changer. I can find what I need in seconds.',
            rating: 5,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        },
        {
            name: 'Emma Davis',
            role: 'Busy Professional',
            text: 'Fast shipping and excellent customer service. Highly recommend SmartCart!',
            rating: 5,
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        },
    ];

    // Map API categories to include icons
    const getCategoryWithIcon = (cat) => {
        const iconMap = {
            'electronics': '📱',
            'fashion': '👔',
            'home': '🏠',
            'sports': '⚽',
            'books': '📚',
            'toys': '🧸',
        };
        return {
            ...cat,
            icon: iconMap[cat.slug] || '📦',
        };
    };

    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);

            try {
                const params = activeCategory === 'all' ? {} : { category: activeCategory };
                const [productRes, categoryRes] = await Promise.all([
                    api.get('products/', { params }),
                    api.get('categories/'),
                ]);
                setProducts(productRes.data);
                setCategories(categoryRes.data.map(getCategoryWithIcon));
            } catch (error) {
                console.error('Failed to fetch catalog', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, [api, activeCategory]);

    const filteredProducts = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

    const displayedProducts = filteredProducts.slice(0, 6);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Shop Smart, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Live Better</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Experience next-generation shopping with AI-powered recommendations, voice search, and lightning-fast checkout. Discover premium products at unbeatable prices.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    Shop Now <ChevronRight className="w-4 h-4" />
                                </motion.button>
                                {!user ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowLoginModal(true)}
                                        className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg font-semibold transition-all"
                                    >
                                        Create Account
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/cart')}
                                        className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <ShoppingCart className="w-4 h-4" /> View Cart
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="aspect-square bg-gradient-to-br from-blue-200 to-purple-200 rounded-full absolute inset-0 blur-3xl opacity-30"></div>
                            <img
                                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
                                alt="Featured Product"
                                className="relative z-10 w-full rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Promo Banner */}
            <section className="bg-gradient-to-r from-red-500 to-pink-500 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center justify-center gap-2"
                    >
                        <TrendingUp className="w-6 h-6" />
                        <span className="text-xl font-bold">🎉 Mega Sale: Up to 50% OFF + FREE SHIPPING on orders over $50!</span>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose SmartCart?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Innovative features designed to make your shopping experience exceptional
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="p-8 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        className="flex flex-wrap justify-center gap-4 md:gap-6"
                    >
                        <motion.button
                            key="all"
                            variants={itemVariants}
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all ${
                                activeCategory === 'all'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-900 border border-gray-300 hover:border-blue-500'
                            }`}
                        >
                            <span className="text-xl mr-2">📦</span>All Products
                        </motion.button>
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.id}
                                variants={itemVariants}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all ${
                                    activeCategory === cat.slug
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-900 border border-gray-300 hover:border-blue-500'
                                }`}
                            >
                                <span className="text-xl mr-2">{cat.icon}</span>{cat.name}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {activeCategory === 'all' ? 'Featured Products' : `Shop ${categories.find(c => c.slug === activeCategory)?.name || 'Products'}`}
                        </h2>
                        <p className="text-xl text-gray-600">Handpicked selection of premium items</p>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : displayedProducts.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {displayedProducts.map((product) => (
                                <motion.div key={product.id} variants={itemVariants}>
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-xl text-gray-500">No products found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Customers</h2>
                        <p className="text-xl text-gray-600">See what real people are saying about SmartCart</p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {testimonials.map((testimonial, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                >
                    {user ? (
                        <>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome Back, {user.username}! 👋</h2>
                            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-50">
                                Continue shopping and discover new products tailored just for you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/cart')}
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <ShoppingCart className="w-5 h-5" /> View Cart
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/profile')}
                                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                                >
                                    <User className="w-5 h-5" /> My Profile
                                </motion.button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Shopping?</h2>
                            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-50">
                                Join millions of happy customers and experience the future of shopping today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowLoginModal(true)}
                                    className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all"
                                >
                                    Create Account
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                                    className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-lg font-semibold transition-all"
                                >
                                    Browse Products
                                </motion.button>
                            </div>
                        </>
                    )}
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                                    SmartCart
                                </span>
                            </h3>
                            <p className="text-sm mb-4">Your one-stop destination for premium shopping with AI-powered recommendations.</p>
                            <div className="flex gap-4">
                                {['f', 't', 'i', 'l'].map((icon, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.2 }}
                                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all text-lg font-bold"
                                    >
                                        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'][i][0]}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                {['Home', 'Products', 'About Us', 'Blog'].map((link, i) => (
                                    <li key={i}><a href="#" className="hover:text-indigo-400 transition-colors">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                {['Help Center', 'Contact Us', 'Shipping Info', 'Returns'].map((link, i) => (
                                    <li key={i}><a href="#" className="hover:text-indigo-400 transition-colors">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Newsletter</h4>
                            <p className="text-sm mb-4">Get exclusive deals and updates</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l text-sm focus:outline-none focus:bg-gray-700"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r text-sm font-semibold transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Award className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm">100% Authentic Products</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm">Free Shipping on Orders Over $50</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm">Secure Payments & Data Protection</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm">24/7 Customer Support</span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
                            <p>&copy; 2024 SmartCart. All rights reserved. | <a href="#" className="hover:text-indigo-400">Privacy Policy</a> | <a href="#" className="hover:text-indigo-400">Terms of Service</a></p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Login Modal */}
            {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

export default LandingPage;
