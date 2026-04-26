import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const Payment = () => {
    const { orderId } = useParams();
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [error, setError] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        fetchOrder();
        // Only add the script once
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => setError('Failed to load Razorpay. Check your internet connection.');
            document.body.appendChild(script);
        } else {
            setScriptLoaded(true);
        }
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`orders/${orderId}/`);
            setOrder(res.data);
        } catch { setError('Failed to load order'); }
        finally { setLoading(false); }
    };

    const handlePayment = async () => {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

        // Guard: check Razorpay key
        if (!razorpayKey) {
            setError('Razorpay API key is missing. Please check your Vercel environment variables (VITE_RAZORPAY_KEY_ID).');
            setPaymentStatus('failed');
            return;
        }
        // Guard: check Razorpay script loaded
        if (!window.Razorpay) {
            setError('Razorpay is still loading. Please wait a moment and try again.');
            return;
        }

        setPaymentStatus('processing'); setError('');
        try {
            const orderRes = await api.post('payments/create-razorpay-order/', { order_id: orderId, amount: order.total_price });
            const options = {
                key: razorpayKey,
                amount: orderRes.data.amount, currency: orderRes.data.currency,
                name: 'SmartCart', description: `Order #${orderId}`,
                order_id: orderRes.data.razorpay_order_id,
                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999"
                },
                handler: (response) => handlePaymentSuccess(response),
                modal: {
                    ondismiss: () => {
                        setPaymentStatus('pending');
                    }
                },
                theme: { color: '#2874f0' },
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(`Payment failed: ${response.error.description || response.error.reason || 'Unknown error'}`);
                setPaymentStatus('failed');
            });
            rzp.open();
        } catch (err) {
            // Show the actual backend error message
            const errMsg = err.response?.data?.error
                || err.response?.data?.detail
                || err.message
                || 'Could not connect to the payment server. Please check your backend is running.';
            setError(errMsg);
            setPaymentStatus('failed');
        }
    };

    const handlePaymentSuccess = async (response) => {
        try {
            await api.post('payments/verify-payment/', {
                order_id: orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            });
            setPaymentStatus('success');
            setTimeout(() => navigate('/profile'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
            setPaymentStatus('failed');
        }
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 16px' }}>
                <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    {/* Success */}
                    {paymentStatus === 'success' && (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <CheckCircle size={64} color="#388e3c" style={{ margin: '0 auto 20px' }} />
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Payment Successful!</h2>
                            <p style={{ fontSize: '14px', color: '#878787', marginBottom: '12px' }}>Order #{orderId} has been confirmed</p>
                            <p style={{ fontSize: '13px', color: '#878787' }}>Redirecting to your orders...</p>
                        </div>
                    )}

                    {/* Failed */}
                    {paymentStatus === 'failed' && (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <AlertCircle size={64} color="#ff6161" style={{ margin: '0 auto 20px' }} />
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Payment Failed</h2>
                            {error && <p style={{ color: '#c62828', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}
                            <button
                                onClick={handlePayment}
                                style={{ background: '#2874f0', color: '#fff', padding: '12px 40px', border: 'none', borderRadius: '3px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Retry Payment
                            </button>
                        </div>
                    )}

                    {/* Pending */}
                    {(paymentStatus === 'pending' || paymentStatus === 'processing') && order && (
                        <>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', background: '#f1f3f6' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#878787', textTransform: 'uppercase' }}>Order Summary</h2>
                            </div>

                            <div style={{ padding: '24px' }}>
                                {/* Order info */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                    <span style={{ color: '#878787' }}>Order ID</span>
                                    <span style={{ fontWeight: 600 }}>#{orderId}</span>
                                </div>

                                {/* Items */}
                                {order.items?.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px', borderBottom: '1px solid #f0f0f0' }}>
                                        <span>{item.product?.name || 'Item'} × {item.quantity}</span>
                                        <span style={{ fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', marginTop: '12px', borderTop: '1px dashed #e0e0e0', fontSize: '18px', fontWeight: 700 }}>
                                    <span>Total</span>
                                    <span style={{ color: '#212121' }}>₹{Number(order.total_price).toLocaleString('en-IN')}</span>
                                </div>

                                {/* Shipping */}
                                <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f5f5f5', borderRadius: '3px' }}>
                                    <p style={{ fontSize: '12px', color: '#878787', marginBottom: '4px' }}>Deliver to:</p>
                                    <p style={{ fontSize: '14px', color: '#212121' }}>{order.shipping_address}</p>
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={paymentStatus === 'processing' || !scriptLoaded}
                                    style={{
                                        marginTop: '24px', width: '100%', padding: '14px',
                                        background: '#fb641b', color: '#fff', border: 'none',
                                        borderRadius: '3px', fontSize: '16px', fontWeight: 600,
                                        cursor: (paymentStatus === 'processing' || !scriptLoaded) ? 'not-allowed' : 'pointer',
                                        opacity: (paymentStatus === 'processing' || !scriptLoaded) ? 0.7 : 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    }}
                                >
                                    {paymentStatus === 'processing' ? <><Loader size={18} className="animate-spin" /> Processing...</> : !scriptLoaded ? 'Loading...' : 'PAY NOW'}
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', color: '#878787', fontSize: '12px' }}>
                                    <ShieldCheck size={14} /> Secure payment powered by Razorpay
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Payment;
