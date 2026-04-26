import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Wallet, PackageCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { isAdminUser } from '../utils/admin';

function Dashboard() {
    const { user, api } = useContext(AuthContext);
    const { cartItems, cartTotal } = useContext(CartContext);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const isAdmin = isAdminUser(user);

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadOrders = async () => {
            setLoadingOrders(true);
            try {
                const response = await api.get('orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to load orders', error);
            } finally {
                setLoadingOrders(false);
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
        <div className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
            <div className="max-w-6xl mx-auto">
                <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 p-8 md:p-10">
                    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
                    <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">Account center</p>
                    <h1 className="mt-3 text-4xl font-black tracking-tight">Welcome back, {user.username}</h1>
                    <p className="mt-3 max-w-2xl text-zinc-300">
                        Track orders, keep your address updated, and move from cart to checkout in a few clicks.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-5 py-2.5 font-bold text-zinc-900 hover:brightness-110">
                            Continue shopping <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/profile" className="inline-flex items-center rounded-full border border-zinc-700 px-5 py-2.5 font-semibold text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800">
                            Manage profile
                        </Link>
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-wide text-zinc-400">Cart items</p>
                            <ShoppingBag className="h-5 w-5 text-emerald-300" />
                        </div>
                        <p className="mt-2 text-4xl font-black">{cartItems.length}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-wide text-zinc-400">Cart value</p>
                            <Wallet className="h-5 w-5 text-amber-300" />
                        </div>
                        <p className="mt-2 text-4xl font-black">Rs. {cartTotal.toFixed(2)}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-wide text-zinc-400">Orders placed</p>
                            <PackageCheck className="h-5 w-5 text-cyan-300" />
                        </div>
                        <p className="mt-2 text-4xl font-black">{orders.length}</p>
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Link to="/products" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/60">
                        <h2 className="text-xl font-bold">Shop products</h2>
                        <p className="mt-2 text-zinc-400">Discover new arrivals and add the best picks to your cart.</p>
                    </Link>
                    <Link to="/cart" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/60">
                        <h2 className="text-xl font-bold">View cart</h2>
                        <p className="mt-2 text-zinc-400">Update quantities, review totals, and place your next order.</p>
                    </Link>
                    <Link to="/profile" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:-translate-y-0.5 hover:border-emerald-400/60">
                        <h2 className="text-xl font-bold">Update profile</h2>
                        <p className="mt-2 text-zinc-400">Keep phone and delivery details ready for faster checkout.</p>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="rounded-2xl border border-cyan-600/40 bg-cyan-900/10 p-6 transition hover:-translate-y-0.5 hover:border-cyan-400/60">
                            <h2 className="text-xl font-bold">Admin operations</h2>
                            <p className="mt-2 text-zinc-300">Manage products, inspect orders, and run e-commerce operations.</p>
                        </Link>
                    )}
                </section>

                <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <h2 className="text-2xl font-bold">Recent orders</h2>
                    {loadingOrders ? (
                        <p className="mt-4 text-zinc-400">Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <p className="mt-4 text-zinc-400">No orders yet. Your first order will appear here.</p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex flex-col gap-2 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-semibold">Order #{order.id}</p>
                                        <p className="text-sm text-zinc-400">{new Date(order.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300">{order.status}</span>
                                        <span className="font-bold text-emerald-300">Rs. {Number(order.total_price).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
