import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ShoppingCart, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || !user.is_staff) {
            navigate('/');
            return;
        }
        fetchDashboard();
    }, [user]);

    const fetchDashboard = async () => {
        try {
            const [dashRes, ordersRes] = await Promise.all([
                api.get('admin/dashboard/'),
                api.get('admin/orders/'),
            ]);
            setDashboard(dashRes.data);
            setOrders(ordersRes.data.results || []);
        } catch (err) {
            setError('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <Icon className="w-12 h-12 text-gray-400 opacity-50" />
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-xl text-gray-700 mb-4">{error}</p>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your e-commerce platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={ShoppingCart}
                        label="Total Orders"
                        value={dashboard?.total_orders || 0}
                        color="border-blue-500"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Total Revenue"
                        value={`₹${dashboard?.total_revenue?.toFixed(2) || 0}`}
                        color="border-green-500"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={dashboard?.total_users || 0}
                        color="border-purple-500"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Pending Orders"
                        value={dashboard?.pending_orders || 0}
                        color="border-yellow-500"
                    />
                </div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow"
                >
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6" />
                            Recent Orders
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{order.user}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ₹{order.total_price}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                                    order.status === 'Paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'Shipped'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : order.status === 'Delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.length === 0 && (
                        <div className="p-8 text-center">
                            <p className="text-gray-600">No orders found</p>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/admin/orders')}
                        className="bg-white hover:shadow-lg rounded-lg p-6 border border-gray-200 transition-all text-left"
                    >
                        <ShoppingCart className="w-8 h-8 text-blue-600 mb-2" />
                        <h3 className="font-bold text-gray-900">Manage Orders</h3>
                        <p className="text-sm text-gray-600 mt-1">Update order status and details</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/admin/products')}
                        className="bg-white hover:shadow-lg rounded-lg p-6 border border-gray-200 transition-all text-left"
                    >
                        <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
                        <h3 className="font-bold text-gray-900">Manage Products</h3>
                        <p className="text-sm text-gray-600 mt-1">Add, edit, or remove products</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate('/admin/users')}
                        className="bg-white hover:shadow-lg rounded-lg p-6 border border-gray-200 transition-all text-left"
                    >
                        <Users className="w-8 h-8 text-purple-600 mb-2" />
                        <h3 className="font-bold text-gray-900">Manage Users</h3>
                        <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
