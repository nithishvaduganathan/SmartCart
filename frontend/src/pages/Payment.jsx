import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Payment = () => {
    const { orderId } = useParams();
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrder();
        loadRazorpayScript();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`orders/${orderId}/`);
            setOrder(response.data);
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    };

    const handlePayment = async () => {
        setPaymentStatus('processing');
        setError('');

        try {
            // Create Razorpay order
            const orderResponse = await api.post('payments/create-razorpay-order/', {
                order_id: orderId,
                amount: order.total_price,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency,
                name: 'SmartCart',
                description: `Order #${orderId}`,
                order_id: orderResponse.data.razorpay_order_id,
                handler: (response) => handlePaymentSuccess(response),
                prefill: {
                    email: order.user?.email || '',
                    contact: order.user?.profile?.phone || '',
                },
                notes: {
                    order_id: orderId,
                },
                theme: {
                    color: '#4f46e5',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to initiate payment');
            setPaymentStatus('failed');
        }
    };

    const handlePaymentSuccess = async (response) => {
        try {
            // Verify payment
            const verifyResponse = await api.post('payments/verify-payment/', {
                order_id: orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            });

            setPaymentStatus('success');

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Payment verification failed');
            setPaymentStatus('failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Order not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow p-8"
                >
                    {/* Success State */}
                    {paymentStatus === 'success' && (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-600 mb-6">Your order has been placed successfully</p>
                            <p className="text-lg font-semibold text-gray-900 mb-8">
                                Order ID: <span className="text-indigo-600">#{orderId}</span>
                            </p>
                            <p className="text-gray-600 mb-8">Redirecting to confirmation page...</p>
                        </div>
                    )}

                    {/* Failed State */}
                    {paymentStatus === 'failed' && (
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="mb-6"
                            >
                                <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                            {error && <p className="text-red-600 mb-6">{error}</p>}
                            <p className="text-gray-600 mb-8">Please try again or contact support</p>
                            <button
                                onClick={handlePayment}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold"
                            >
                                Retry Payment
                            </button>
                        </div>
                    )}

                    {/* Pending State */}
                    {(paymentStatus === 'pending' || paymentStatus === 'processing') && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Review Your Order</h1>

                            {/* Order Summary */}
                            <div className="mb-8 pb-8 border-b">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Details</h2>
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Order ID:</span>
                                        <span className="font-semibold text-gray-900">#{orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Amount:</span>
                                        <span className="font-semibold text-indigo-600 text-lg">
                                            ₹{order.total_price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className="font-semibold text-yellow-600">{order.status}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="mb-8 pb-8 border-b">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Items</h2>
                                <div className="space-y-3">
                                    {order.items && order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-gray-700">
                                            <span>
                                                {item.product.name} x {item.quantity}
                                            </span>
                                            <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
                                <p className="text-gray-700 whitespace-pre-wrap">{order.shipping_address}</p>
                            </div>

                            {/* Payment Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePayment}
                                disabled={paymentStatus === 'processing'}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-lg"
                            >
                                {paymentStatus === 'processing' ? (
                                    <>
                                        <Loader className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Pay with Razorpay'
                                )}
                            </motion.button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                You will be redirected to Razorpay secure payment gateway
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Payment;
