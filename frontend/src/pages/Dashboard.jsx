import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Dashboard() {
    const { user, api } = useContext(AuthContext);
    const { cartItems, cartTotal } = useContext(CartContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadOrders = async () => {
            try {
                const response = await api.get('orders/');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to load orders', error);
            }
        };

        loadOrders();
    }, [api, user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-3">Login required</h1>
                    <p className="text-zinc-400 mb-6">Sign in to view your dashboard.</p>
                    <Link to="/login" className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-md">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <p className="text-sm uppercase tracking-wide text-emerald-300 mb-3">Account</p>
                <h1 className="text-4xl font-bold mb-4">Welcome, {user.username}</h1>
                <p className="text-zinc-300 max-w-2xl">
                    Manage your cart, profile, and recent orders from one place.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <p className="text-zinc-400">Cart Items</p>
                        <p className="text-3xl font-bold mt-2">{cartItems.length}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <p className="text-zinc-400">Cart Total</p>
                        <p className="text-3xl font-bold mt-2">Rs. {cartTotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                        <p className="text-zinc-400">Orders</p>
                        <p className="text-3xl font-bold mt-2">{orders.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <Link to="/" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500 transition">
                        <h2 className="text-xl font-semibold">Shop Products</h2>
                        <p className="text-zinc-400 mt-2">Browse the latest products and add them to your cart.</p>
                    </Link>
                    <Link to="/cart" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500 transition">
                        <h2 className="text-xl font-semibold">View Cart</h2>
                        <p className="text-zinc-400 mt-2">Review quantities and place your next order.</p>
                    </Link>
                    <Link to="/profile" className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500 transition">
                        <h2 className="text-xl font-semibold">Update Profile</h2>
                        <p className="text-zinc-400 mt-2">Keep your contact details and address ready.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
