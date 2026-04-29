import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Users, TrendingUp, Package, Box, AlertCircle, ArrowRight, Activity, DollarSign, Calendar, ChevronRight } from 'lucide-react';
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
        const map = { 
            Pending: { bg: 'rgba(255, 159, 0, 0.1)', color: '#ff9f00', border: '#ff9f00' },
            Paid: { bg: 'rgba(40, 116, 240, 0.1)', color: '#2874f0', border: '#2874f0' },
            Shipped: { bg: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0', border: '#9c27b0' },
            Delivered: { bg: 'rgba(56, 142, 60, 0.1)', color: '#388e3c', border: '#388e3c' },
            Cancelled: { bg: 'rgba(255, 97, 97, 0.1)', color: '#ff6161', border: '#ff6161' }
        };
        return map[status] || { bg: 'rgba(135, 135, 135, 0.1)', color: '#878787', border: '#878787' };
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div style={{ width: '50px', height: '50px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s ease-in-out infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const statCards = [
        { label: 'Total Revenue', value: `₹${Number(stats?.total_revenue || 0).toLocaleString('en-IN')}`, icon: <DollarSign size={28} />, color: '#10b981', gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
        { label: 'Total Orders', value: stats?.total_orders ?? 0, icon: <ShoppingCart size={28} />, color: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' },
        { label: 'Total Users', value: stats?.total_users ?? 0, icon: <Users size={28} />, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)' },
        { label: 'Pending Orders', value: stats?.pending_orders ?? 0, icon: <AlertCircle size={28} />, color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' },
    ];

    return (
        <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
            minHeight: '100vh',
            fontFamily: "'Inter', 'Roboto', sans-serif"
        }}>
            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
                    border-radius: 16px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .glass-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                }
                .stat-icon-wrap {
                    position: relative;
                    overflow: hidden;
                }
                .stat-icon-wrap::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
                    opacity: 0;
                    transform: scale(0.5);
                    transition: all 0.5s ease;
                }
                .glass-card:hover .stat-icon-wrap::after {
                    opacity: 1;
                    transform: scale(1);
                }
                .action-link {
                    position: relative;
                    overflow: hidden;
                }
                .action-link::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.5s ease;
                }
                .action-link:hover::before {
                    transform: translateX(100%);
                }
                .table-row {
                    transition: all 0.2s ease;
                }
                .table-row:hover {
                    background: rgba(255, 255, 255, 0.9) !important;
                    transform: scale(1.01);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border-radius: 8px;
                    z-index: 10;
                    position: relative;
                }
            `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Activity color="#3b82f6" /> Analytics Dashboard
                        </h1>
                        <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>Monitor your platform's performance in real-time</p>
                    </div>
                    
                    {/* Quick Links */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                            { label: 'Orders', to: '/admin/orders', icon: <Package size={18} />, color: '#3b82f6' },
                            { label: 'Products', to: '/admin/products', icon: <Box size={18} />, color: '#8b5cf6' },
                            { label: 'Storefront', to: '/products', icon: <ShoppingCart size={18} />, color: '#10b981' },
                        ].map(link => (
                            <Link key={link.label} to={link.to} className="action-link glass-card" style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', color: '#1e293b', fontSize: '14px', fontWeight: 600,
                                textDecoration: 'none', borderRadius: '12px',
                            }}>
                                <span style={{ color: link.color }}>{link.icon}</span> {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {statCards.map((card, idx) => (
                        <div key={card.label} className="glass-card" style={{
                            padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ 
                                position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px',
                                background: card.gradient, opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)'
                            }} />
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className="stat-icon-wrap" style={{ 
                                    width: '56px', height: '56px', borderRadius: '16px', 
                                    background: card.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    color: '#fff', boxShadow: `0 8px 16px ${card.color}40`
                                }}>
                                    {card.icon}
                                </div>
                                <div style={{ 
                                    background: 'rgba(255,255,255,0.8)', padding: '6px 12px', borderRadius: '20px', 
                                    fontSize: '12px', fontWeight: 600, color: card.color, display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    <TrendingUp size={12} /> +12%
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>{card.label}</p>
                                <p style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ 
                        padding: '24px 32px', borderBottom: '1px solid rgba(0,0,0,0.05)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.4)'
                    }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={20} color="#3b82f6" /> Recent Transactions
                        </h2>
                        <Link to="/admin/orders" style={{ 
                            color: '#3b82f6', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px',
                            background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', transition: 'all 0.2s'
                        }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                           onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div style={{ overflowX: 'auto', padding: '0 16px 16px 16px' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                                <tr>
                                    {['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 10).map((order) => {
                                    const statusStyle = getStatusColor(order.status);
                                    return (
                                        <tr key={order.id} className="table-row" style={{ background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
                                            <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusStyle.color }} />
                                                    #{order.id}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 'bold', fontSize: '12px' }}>
                                                        {(order.user?.username || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                                                        {order.user?.username || `User ${order.user || order.user_id}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                                                ₹{Number(order.total_price).toLocaleString('en-IN')}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <span style={{ 
                                                    fontSize: '12px', fontWeight: 700, padding: '6px 12px', borderRadius: '20px', 
                                                    color: statusStyle.color, background: statusStyle.bg, border: `1px solid ${statusStyle.border}40`
                                                }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <button onClick={() => navigate('/admin/orders')} style={{ 
                                                    background: '#fff', border: '1px solid #e2e8f0', color: '#0f172a', 
                                                    fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                                                    transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                                }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#3b82f6'; }}
                                                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}>
                                                    Details <ChevronRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={32} color="#94a3b8" />
                            </div>
                            <p style={{ fontSize: '16px', fontWeight: 500 }}>No recent transactions found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

