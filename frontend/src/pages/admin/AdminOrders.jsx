import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronLeft } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/admin';

const AdminOrders = () => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        if (!isAdminUser(user)) { navigate('/'); return; }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await api.get('admin/orders/');
            setOrders(res.data.results || []);
        } catch { console.error('Failed to load orders'); }
        finally { setLoading(false); }
    };

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(`admin/orders/${orderId}/status/`, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch { console.error('Failed to update status'); }
        finally { setUpdatingId(null); }
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

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Link to="/admin/dashboard" style={{ color: '#2874f0', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#212121' }}>Manage Orders</h1>
                        <p style={{ fontSize: '14px', color: '#878787' }}>{orders.length} total orders</p>
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    {['Order ID', 'Customer', 'Items', 'Amount', 'Address', 'Status', 'Date', 'Update Status'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#878787', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#2874f0' }}>#{order.id}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{order.user?.username || `User ${order.user || order.user_id}`}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#878787' }}>{order.items?.length || 0} items</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600 }}>₹{Number(order.total_price).toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#878787', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {order.shipping_address}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '3px', color: '#fff', background: getStatusColor(order.status) }}>{order.status}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#878787', whiteSpace: 'nowrap' }}>
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                disabled={updatingId === order.id}
                                                style={{
                                                    padding: '6px 8px', border: '1px solid #e0e0e0',
                                                    borderRadius: '3px', fontSize: '13px', color: '#212121',
                                                    cursor: 'pointer', background: '#fff',
                                                    opacity: updatingId === order.id ? 0.5 : 1,
                                                }}
                                            >
                                                {['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <Package size={48} color="#b0b0b0" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: '#878787' }}>No orders found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
