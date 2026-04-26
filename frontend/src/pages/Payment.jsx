import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader, ShieldCheck, CreditCard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const Payment = () => {
    const { orderId } = useParams();
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
    const [error, setError] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`orders/${orderId}/`);
            setOrder(res.data);
        } catch { 
            setError('Failed to load order'); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleMockPayment = async (e) => {
        e.preventDefault();
        
        // Basic frontend validation for the mock form
        if (cardNumber.length < 16 || !expiry || cvv.length < 3) {
            setError('Please enter valid mock card details (any 16 digits).');
            return;
        }

        setPaymentStatus('processing'); 
        setError('');

        try {
            // Simulate network delay for realism
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Call the new backend mock processing endpoint
            const res = await api.post('payments/mock-process/', { order_id: orderId });
            
            if (res.data.success) {
                setPaymentStatus('success');
                setTimeout(() => navigate('/profile'), 3000);
            } else {
                throw new Error('Payment failed on server');
            }
        } catch (err) {
            console.error('Mock Payment Error:', err);
            const errMsg = err.response?.data?.error || err.message || 'Payment processing failed.';
            setError(errMsg);
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
            <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
                <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    
                    {/* Header */}
                    <div style={{ padding: '24px', background: '#2874f0', color: 'white', textAlign: 'center' }}>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <ShieldCheck size={28} />
                            SmartCart Secure Checkout
                        </h1>
                        <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Simulated Payment Gateway</p>
                    </div>

                    {/* Success State */}
                    {paymentStatus === 'success' && (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <CheckCircle size={72} color="#388e3c" style={{ margin: '0 auto 24px' }} />
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Payment Successful!</h2>
                            <p style={{ fontSize: '16px', color: '#878787', marginBottom: '16px' }}>Order #{orderId} has been confirmed</p>
                            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '4px', display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
                                Amount Paid: ₹{Number(order?.total_price).toLocaleString('en-IN')}
                            </div>
                            <p style={{ fontSize: '14px', color: '#878787' }}>Redirecting to your orders in a few seconds...</p>
                        </div>
                    )}

                    {/* Failed State */}
                    {paymentStatus === 'failed' && (
                        <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                            <AlertCircle size={72} color="#ff6161" style={{ margin: '0 auto 24px' }} />
                            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Payment Failed</h2>
                            {error && <p style={{ color: '#c62828', fontSize: '15px', marginBottom: '24px', background: '#ffebee', padding: '12px', borderRadius: '4px' }}>{error}</p>}
                            <button
                                onClick={() => setPaymentStatus('pending')}
                                style={{ background: '#2874f0', color: '#fff', padding: '14px 40px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Pending / Processing State */}
                    {(paymentStatus === 'pending' || paymentStatus === 'processing') && order && (
                        <div style={{ padding: '32px' }}>
                            
                            {/* Order Summary */}
                            <div style={{ marginBottom: '32px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
                                    <span style={{ color: '#555' }}>Order ID:</span>
                                    <span style={{ fontWeight: 600, color: '#212121' }}>#{orderId}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e0e0e0', paddingTop: '12px', fontSize: '20px', fontWeight: 700 }}>
                                    <span>Total Amount:</span>
                                    <span style={{ color: '#2874f0' }}>₹{Number(order.total_price).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            {/* Mock Payment Form */}
                            <form onSubmit={handleMockPayment}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#212121', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CreditCard size={20} />
                                    Enter Dummy Card Details
                                </h3>
                                
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: 500 }}>Card Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="1234 5678 9101 1121" 
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        maxLength="16"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', fontSize: '15px', outline: 'none' }}
                                        disabled={paymentStatus === 'processing'}
                                    />
                                </div>
                                
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: 500 }}>Expiry (MM/YY)</label>
                                        <input 
                                            type="text" 
                                            placeholder="12/25" 
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            maxLength="5"
                                            style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', fontSize: '15px', outline: 'none' }}
                                            disabled={paymentStatus === 'processing'}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', fontWeight: 500 }}>CVV</label>
                                        <input 
                                            type="password" 
                                            placeholder="123" 
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            maxLength="3"
                                            style={{ width: '100%', padding: '12px', border: '1px solid #d4d5d9', borderRadius: '4px', fontSize: '15px', outline: 'none' }}
                                            disabled={paymentStatus === 'processing'}
                                        />
                                    </div>
                                </div>

                                {error && <p style={{ color: '#d32f2f', fontSize: '14px', marginBottom: '16px' }}>{error}</p>}

                                <button
                                    type="submit"
                                    disabled={paymentStatus === 'processing'}
                                    style={{
                                        width: '100%', padding: '16px',
                                        background: paymentStatus === 'processing' ? '#9dbcf2' : '#fb641b', 
                                        color: '#fff', border: 'none',
                                        borderRadius: '4px', fontSize: '16px', fontWeight: 700,
                                        cursor: paymentStatus === 'processing' ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'background 0.2s',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {paymentStatus === 'processing' ? (
                                        <><Loader size={20} className="animate-spin" /> Processing Payment...</>
                                    ) : (
                                        `PAY ₹${Number(order.total_price).toLocaleString('en-IN')}`
                                    )}
                                </button>
                                
                                <p style={{ textAlign: 'center', fontSize: '12px', color: '#878787', marginTop: '16px' }}>
                                    This is a simulated gateway. Enter any dummy data to proceed.
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Payment;
