import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
    const { api, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [orderCreating, setOrderCreating] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await api.get('cart/');
            setCartItems(response.data.items || []);
            setEmail(user.email);
        } catch (err) {
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const handleCreateOrder = async () => {
        if (!shippingAddress.trim()) {
            setError('Please enter shipping address');
            return;
        }

        setOrderCreating(true);
        setError('');

        try {
            const response = await api.post('orders/', {
                shipping_address: shippingAddress,
            });

            // Redirect to payment page
            navigate(`/payment/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create order');
        } finally {
            setOrderCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const total = calculateTotal();
    const tax = total * 0.05;
    const finalTotal = total + tax;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Checkout</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6" />
                                Shipping Address
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="House number, street, city, state, pincode"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <img
                                            src={item.product.image_url || 'https://via.placeholder.com/80'}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ₹{(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                            </div>

                            <div className="flex justify-between mb-6">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-indigo-600">₹{finalTotal.toFixed(2)}</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateOrder}
                                disabled={orderCreating}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <CreditCard className="w-5 h-5" />
                                {orderCreating ? 'Creating order...' : 'Proceed to Payment'}
                                <ChevronRight className="w-4 h-4" />
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                You will be redirected to Razorpay secure payment gateway
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
