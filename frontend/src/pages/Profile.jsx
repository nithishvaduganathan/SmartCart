import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Phone, Save, ChevronRight, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

function Profile() {
    const { user, api, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ phone: '', address: '' });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;
        const loadData = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    api.get('auth/profile/'),
                    api.get('orders/'),
                ]);
                setProfile({ phone: profileRes.data.phone || '', address: profileRes.data.address || '' });
                const orderData = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.results || []);
                setOrders(orderData);
            } catch (err) {
                console.error('Failed to load profile', err);
            }
        };
        loadData();
    }, [api, user]);

    const saveProfile = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.put('auth/profile/', profile);
            setMessage('Profile updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch { setError('Failed to update profile'); }
    };

    const getStatusColor = (status) => {
        const map = { Pending: '#ff9f00', Paid: '#2874f0', Shipped: '#9c27b0', Delivered: '#388e3c', Cancelled: '#ff6161' };
        return map[status] || '#878787';
    };

    if (!user) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ background: '#fff', padding: '40px', borderRadius: '4px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Please Login</h2>
                <p style={{ color: '#878787', fontSize: '14px', marginBottom: '24px' }}>Login to view your profile and orders</p>
                <Link to="/login" style={{ background: '#fb641b', color: '#fff', padding: '12px 48px', borderRadius: '3px', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
            </div>
        </div>
    );

    const sidebarItems = [
        { key: 'profile', icon: <User size={18} />, label: 'My Profile' },
        { key: 'orders', icon: <Package size={18} />, label: 'My Orders' },
    ];

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
                <div className="profile-layout">
                    {/* Sidebar */}
                    <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        {/* User Card */}
                        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f3f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} color="#2874f0" />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#878787' }}>Hello,</p>
                                <p style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>{user.username || user.user?.username}</p>
                            </div>
                        </div>

                        {/* Nav Items */}
                        {sidebarItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                style={{
                                    width: '100%', padding: '14px 20px', border: 'none',
                                    background: activeTab === item.key ? '#f1f3f6' : '#fff',
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    fontSize: '14px', fontWeight: 500, color: '#212121',
                                    cursor: 'pointer', textAlign: 'left',
                                    borderLeft: activeTab === item.key ? '3px solid #2874f0' : '3px solid transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <span style={{ color: '#2874f0' }}>{item.icon}</span>
                                {item.label}
                                <ChevronRight size={16} style={{ marginLeft: 'auto', color: '#b0b0b0' }} />
                            </button>
                        ))}

                        <button onClick={() => { logout(); navigate('/'); }} style={{
                            width: '100%', padding: '14px 20px', border: 'none', background: '#fff',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            fontSize: '14px', fontWeight: 500, color: '#ff6161',
                            cursor: 'pointer', textAlign: 'left', borderLeft: '3px solid transparent',
                            borderTop: '1px solid #f0f0f0',
                        }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </div>

                    {/* Content */}
                    <div>
                        {message && (
                            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }}>{message}</div>
                        )}
                        {error && (
                            <div style={{ background: '#fce4ec', color: '#c62828', padding: '12px 16px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }}>{error}</div>
                        )}

                        {activeTab === 'profile' && (
                            <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Personal Information</h2>
                                </div>
                                <form onSubmit={saveProfile} style={{ padding: '24px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>Username</label>
                                            <input value={user.username || user.user?.username || ''} disabled style={{
                                                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px',
                                                fontSize: '14px', background: '#f5f5f5', color: '#878787',
                                            }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>Email</label>
                                            <input value={user.email || user.user?.email || ''} disabled style={{
                                                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px',
                                                fontSize: '14px', background: '#f5f5f5', color: '#878787',
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                                        <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="Enter phone number" style={{
                                                width: '100%', maxWidth: '400px', padding: '10px 12px', border: '1px solid #e0e0e0',
                                                borderRadius: '3px', fontSize: '14px', color: '#212121',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#2874f0'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>Address</label>
                                        <textarea value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                            placeholder="Enter delivery address" rows="4" style={{
                                                width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0',
                                                borderRadius: '3px', fontSize: '14px', color: '#212121', resize: 'vertical',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#2874f0'}
                                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                        />
                                    </div>

                                    <button type="submit" style={{
                                        background: '#2874f0', color: '#fff', padding: '12px 32px',
                                        border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 600,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                    }}>
                                        <Save size={16} /> SAVE
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 600 }}>My Orders</h2>
                                </div>

                                {orders.length === 0 ? (
                                    <div style={{ padding: '60px', textAlign: 'center' }}>
                                        <Package size={48} color="#b0b0b0" style={{ margin: '0 auto 16px' }} />
                                        <p style={{ fontSize: '16px', color: '#212121', marginBottom: '8px' }}>No orders yet</p>
                                        <p style={{ fontSize: '14px', color: '#878787', marginBottom: '24px' }}>Your orders will appear here</p>
                                        <Link to="/products" style={{ background: '#2874f0', color: '#fff', padding: '10px 32px', borderRadius: '3px', fontWeight: 600, textDecoration: 'none' }}>
                                            Start Shopping
                                        </Link>
                                    </div>
                                ) : (
                                    <div>
                                        {orders.map((order) => (
                                            <div key={order.id} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>Order #{order.id}</span>
                                                        <span style={{
                                                            fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                                                            borderRadius: '3px', color: '#fff',
                                                            background: getStatusColor(order.status),
                                                        }}>{order.status}</span>
                                                    </div>
                                                    <p style={{ fontSize: '12px', color: '#878787' }}>
                                                        {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>
                                                        ₹{Number(order.total_price).toLocaleString('en-IN')}
                                                    </p>
                                                    <p style={{ fontSize: '12px', color: '#878787' }}>
                                                        {order.items?.length || 0} item(s)
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;
