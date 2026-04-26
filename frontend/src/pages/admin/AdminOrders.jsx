import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminOrders = () => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingStatus, setEditingStatus] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        if (!user || !user.is_staff) {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('admin/orders/');
            setOrders(response.data.results || []);
        } catch (err) {
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId) => {
        if (!newStatus) return;

        try {
            await api.put(`admin/orders/${orderId}/status/`, { status: newStatus });
            fetchOrders();
            setEditingStatus(null);
            setNewStatus('');
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const statusOptions = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Manage Orders</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-indigo-600">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {order.user?.username || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ₹{parseFloat(order.total_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {editingStatus === order.id ? (
                                                <select
                                                    value={newStatus || order.status}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
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
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm space-x-3">
                                            {editingStatus === order.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id)}
                                                        className="text-green-600 hover:text-green-700 font-semibold"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingStatus(null)}
                                                        className="text-gray-600 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setEditingStatus(order.id);
                                                            setNewStatus(order.status);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="text-blue-600 hover:text-blue-700 font-semibold"
                                                    >
                                                        View
                                                    </button>
                                                </>
                                            )}
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

                {/* Order Details Modal */}
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedOrder(null)}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Order #{selectedOrder.id}
                            </h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedOrder.user?.username || 'Unknown'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="font-semibold text-gray-900">{selectedOrder.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-semibold text-gray-900">
                                            ₹{parseFloat(selectedOrder.total_price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(selectedOrder.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Shipping Address</p>
                                    <p className="text-gray-900 whitespace-pre-wrap">
                                        {selectedOrder.shipping_address}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Items</p>
                                    <div className="space-y-2">
                                        {selectedOrder.items?.map((item) => (
                                            <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded">
                                                <span className="text-gray-700">
                                                    {item.product?.name} x {item.quantity}
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
