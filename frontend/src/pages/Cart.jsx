import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShieldCheck, Tag } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import Footer from '../components/Footer';

function Cart() {
    const { user, api } = useContext(AuthContext);
    const { cartItems, cartTotal, discountCode, discountAmount, finalTotal, updateQuantity, removeFromCart, fetchCart, applyDiscount, removeDiscount } = useContext(CartContext);
    const navigate = useNavigate();
    const [shippingAddress, setShippingAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [discountInput, setDiscountInput] = useState('');
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [discountError, setDiscountError] = useState('');

    const handleApplyDiscount = async () => {
        setApplyingDiscount(true);
        setDiscountError('');
        const result = await applyDiscount(discountInput);
        if (!result?.ok) setDiscountError(result?.message || 'Invalid code');
        setApplyingDiscount(false);
        setDiscountInput('');
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        if (!shippingAddress.trim()) { setError('Please enter a shipping address'); return; }
        setSubmitting(true);
        try {
            const res = await api.post('orders/', { shipping_address: shippingAddress.trim(), discount_code: discountCode || null });
            await fetchCart();
            setShippingAddress('');
            navigate(`/payment/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Unable to place order');
        } finally { setSubmitting(false); }
    };

    if (!user) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ background: '#fff', borderRadius: '4px', padding: '40px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Missing Cart items?</h2>
                <p style={{ color: '#878787', fontSize: '14px', marginBottom: '24px' }}>Login to see items you added previously</p>
                <Link to="/login" style={{ background: '#fb641b', color: '#fff', padding: '12px 48px', borderRadius: '3px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                    Login
                </Link>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
                {message && (
                    <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }}>{message}</div>
                )}
                {error && (
                    <div style={{ background: '#fce4ec', color: '#c62828', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
                )}

                {cartItems.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: '4px', padding: '80px 40px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🛒</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Your cart is empty!</h2>
                        <p style={{ color: '#878787', fontSize: '14px', marginBottom: '24px' }}>Add items to it now.</p>
                        <Link to="/products" style={{ background: '#2874f0', color: '#fff', padding: '12px 40px', borderRadius: '3px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                            Shop now
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 500 }}>My Cart ({cartItems.length})</h2>
                            </div>

                            {cartItems.map((item) => (
                                <div key={item.id} style={{ padding: '24px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '20px' }}>
                                    {/* Image */}
                                    <div style={{ width: '112px', height: '112px', flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span style={{ color: '#b0b0b0', fontSize: '12px' }}>No Image</span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1 }}>
                                        <Link to={`/products/${item.product.id}`} style={{ fontSize: '16px', fontWeight: 400, color: '#212121', textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                                            {item.product.name}
                                        </Link>
                                        <p style={{ fontSize: '12px', color: '#878787', marginBottom: '8px' }}>
                                            {item.product.category?.name || ''}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '18px', fontWeight: 700 }}>₹{Number(item.product.price).toLocaleString('en-IN')}</span>
                                            <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>₹{Math.round(Number(item.product.price) * 1.3).toLocaleString('en-IN')}</span>
                                            <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 500 }}>23% off</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {/* Quantity */}
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '50px', overflow: 'hidden' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#f1f3f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Minus size={14} />
                                                </button>
                                                <span style={{ padding: '0 16px', fontSize: '14px', fontWeight: 600, background: '#fff', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', height: '32px', display: 'flex', alignItems: 'center' }}>
                                                    {item.quantity}
                                                </span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', background: '#f1f3f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#212121', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}>
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Shipping Address */}
                            <form onSubmit={placeOrder}>
                                <div style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px' }}>Delivery Address</h3>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Enter complete delivery address (House no, Street, City, State, Pincode)"
                                        rows="3"
                                        style={{
                                            width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '3px',
                                            fontSize: '14px', color: '#212121', resize: 'vertical', background: '#fff',
                                        }}
                                    />
                                </div>

                                <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" disabled={submitting} style={{
                                        background: '#fb641b', color: '#fff', padding: '14px 48px',
                                        border: 'none', borderRadius: '3px', fontSize: '16px', fontWeight: 600,
                                        cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                                    }}>
                                        {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Price Details Sidebar */}
                        <div style={{ position: 'sticky', top: '104px' }}>
                            <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#878787', textTransform: 'uppercase' }}>
                                        Price Details
                                    </h3>
                                </div>

                                <div style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                                        <span>Price ({cartItems.length} items)</span>
                                        <span>₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                    {discountCode && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#388e3c' }}>
                                            <span>Discount ({discountCode})</span>
                                            <span>−₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#388e3c' }}>
                                        <span>Delivery Charges</span>
                                        <span style={{ fontWeight: 500 }}>FREE</span>
                                    </div>

                                    <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700 }}>
                                        <span>Total Amount</span>
                                        <span>₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                </div>

                                {/* Discount Code */}
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
                                    {!discountCode ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                value={discountInput}
                                                onChange={(e) => { setDiscountInput(e.target.value); setDiscountError(''); }}
                                                placeholder="Coupon code"
                                                style={{ flex: 1, padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontSize: '14px' }}
                                            />
                                            <button onClick={handleApplyDiscount} disabled={applyingDiscount || !discountInput.trim()} style={{
                                                padding: '8px 16px', background: '#2874f0', color: '#fff', border: 'none',
                                                borderRadius: '3px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                                opacity: (applyingDiscount || !discountInput.trim()) ? 0.6 : 1,
                                            }}>APPLY</button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#e8f5e9', padding: '10px 12px', borderRadius: '3px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32', fontSize: '13px', fontWeight: 500 }}>
                                                <Tag size={14} /> {discountCode} applied
                                            </span>
                                            <button onClick={removeDiscount} style={{ background: 'none', border: 'none', color: '#c62828', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                                REMOVE
                                            </button>
                                        </div>
                                    )}
                                    {discountError && <p style={{ color: '#c62828', fontSize: '12px', marginTop: '6px' }}>{discountError}</p>}
                                </div>
                            </div>

                            {/* Safe payment badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 0', color: '#878787', fontSize: '13px' }}>
                                <ShieldCheck size={16} />
                                Safe and Secure Payments. Easy returns. 100% Authentic products.
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Cart;
