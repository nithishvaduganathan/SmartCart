import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, ShoppingCart, Users, TrendingUp, Package, Box, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/admin';

const AdminDashboard = () => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdminUser(user)) { navigate('/'); return; }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [dashRes, ordersRes] = await Promise.all([
                api.get('admin/dashboard/'),
                api.get('admin/orders/'),
            ]);
            setStats(dashRes.data.metrics || dashRes.data || {});
            setOrders(ordersRes.data.results || []);
        } catch (err) {
            console.error('Dashboard load failed', err);
        } finally { setLoading(false); }
    };

    const getStatusColor = (status) => {
        const map = { Pending: '#ff9f00', Paid: '#2874f0', Shipped: '#9c27b0', Delivered: '#388e3c', Cancelled: '#ff6161' };
        return map[status] || '#878787';
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const statCards = [
        { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: <ShoppingCart size={24} />, color: '#2874f0', bg: '#e8f0fe' },
        { label: 'Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN')}`, icon: <TrendingUp size={24} />, color: '#388e3c', bg: '#e8f5e9' },
        { label: 'Total Users', value: stats?.total_users ?? 0, icon: <Users size={24} />, color: '#9c27b0', bg: '#f3e5f5' },
        { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: <AlertCircle size={24} />, color: '#ff9f00', bg: '#fff3e0' },
    ];

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#212121' }}>Admin Dashboard</h1>
                    <p style={{ fontSize: '14px', color: '#878787' }}>Manage your e-commerce platform</p>
                </div>

                {/* Quick Links */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Orders', to: '/admin/orders', icon: <Package size={16} /> },
                        { label: 'Products', to: '/admin/products', icon: <Box size={16} /> },
                        { label: 'Storefront', to: '/products', icon: <ShoppingCart size={16} /> },
                    ].map(link => (
                        <Link key={link.label} to={link.to} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 20px', background: '#fff', border: '1px solid #e0e0e0',
                            borderRadius: '3px', color: '#2874f0', fontSize: '13px', fontWeight: 600,
                            textDecoration: 'none', transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#2874f0'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2874f0'; }}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {statCards.map((card) => (
                        <div key={card.label} style={{
                            background: '#fff', borderRadius: '4px', padding: '24px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            display: 'flex', alignItems: 'center', gap: '16px',
                        }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                                {card.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '13px', color: '#878787', marginBottom: '4px' }}>{card.label}</p>
                                <p style={{ fontSize: '24px', fontWeight: 700, color: '#212121' }}>{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Orders</h2>
                        <Link to="/admin/orders" style={{ color: '#2874f0', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>VIEW ALL →</Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#878787', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 10).map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#2874f0' }}>#{order.id}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{order.user?.username || `User ${order.user || order.user_id}`}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600 }}>₹{Number(order.total_price).toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '3px', color: '#fff', background: getStatusColor(order.status) }}>{order.status}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#878787' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button onClick={() => navigate('/admin/orders')} style={{ background: 'none', border: 'none', color: '#2874f0', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#878787' }}>No orders found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
