import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MapPin, CreditCard, Mail, Phone, Tag, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
    const { api, user } = useContext(AuthContext);
    const { cartItems, cartTotal, discountCode, discountAmount, finalTotal, applyDiscount, removeDiscount } = useContext(CartContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [orderCreating, setOrderCreating] = useState(false);
    const [discountInput, setDiscountInput] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [discountError, setDiscountError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (cartItems.length === 0) {
            navigate('/cart');
        }
        setEmail(user.email || '');
    }, [user, navigate, cartItems]);

    const handleApplyDiscount = async () => {
        setApplyingDiscount(true);
        setDiscountError('');
        const result = await applyDiscount(discountInput);
        if (!result.ok) {
            setDiscountError(result.message);
        }
        setApplyingDiscount(false);
        setDiscountInput('');
    };

    const handleCreateOrder = async () => {
        if (!shippingAddress.trim()) {
            setError('Please enter shipping address');
            return;
        }

        setOrderCreating(true);
        setError('');

        try {
            const response = await api.post('orders', {
                shipping_address: shippingAddress,
                discount_code: discountCode || null,
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
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 py-12 text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="mb-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 p-8">
                    <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
                    <p className="mt-2 text-zinc-300">Confirm delivery details, apply discount codes, review your items, and continue to secure payment.</p>
                </section>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6" />
                                Shipping Address
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+91"
                                            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Address</label>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="House number, street, city, state, pincode"
                                        rows="4"
                                        className="w-full px-4 py-2 border border-zinc-700 bg-zinc-950 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discount Code Section */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                Promo Code
                            </h2>

                            {!discountCode ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={discountInput}
                                        onChange={(e) => {
                                            setDiscountInput(e.target.value);
                                            setDiscountError('');
                                        }}
                                        placeholder="Enter discount code"
                                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyDiscount}
                                        disabled={applyingDiscount || !discountInput.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-emerald-300">
                                        <Tag className="w-4 h-4" />
                                        <span className="font-semibold">{discountCode}</span>
                                        <span className="text-sm">applied</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={removeDiscount}
                                        className="text-emerald-300 hover:text-emerald-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {discountError && (
                                <p className="text-red-400 text-sm mt-2">{discountError}</p>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Items</h2>

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-4 pb-4 border-b border-zinc-800 last:border-b-0"
                                    >
                                        <img
                                            src={item.product.image_url || 'https://via.placeholder.com/80'}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg bg-zinc-800"
                                        />

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white">{item.product.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1">Quantity: {item.quantity}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-semibold text-white">
                                                Rs. {(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow p-6 sticky top-20">
                            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-zinc-800">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>Rs. {cartTotal.toFixed(2)}</span>
                                </div>
                                {discountCode && (
                                    <div className="flex justify-between text-emerald-400 font-semibold">
                                        <span>Discount ({discountCode})</span>
                                        <span>-Rs. {discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mb-6">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-emerald-400">Rs. {finalTotal.toFixed(2)}</span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCreateOrder}
                                disabled={orderCreating}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
