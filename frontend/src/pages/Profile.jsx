import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Profile() {
    const { user, api } = useContext(AuthContext);
    const [profile, setProfile] = useState({ phone: '', address: '' });
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            return;
        }

        const loadProfile = async () => {
            try {
                const [profileRes, ordersRes] = await Promise.all([
                    api.get('auth/profile/'),
                    api.get('orders/'),
                ]);
                setProfile({
                    phone: profileRes.data.phone || '',
                    address: profileRes.data.address || '',
                });
                setOrders(ordersRes.data);
            } catch (err) {
                console.error('Failed to load profile', err);
                setError('Unable to load profile details.');
            }
        };

        loadProfile();
    }, [api, user]);

    const updateField = (field, value) => {
        setProfile((current) => ({ ...current, [field]: value }));
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.put('auth/profile/', profile);
            setMessage('Profile updated successfully.');
        } catch (err) {
            console.error('Failed to update profile', err);
            setError('Unable to update profile.');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-3">Login required</h1>
                    <p className="text-zinc-400 mb-6">Sign in to manage your profile and orders.</p>
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
                <p className="text-sm uppercase tracking-wide text-emerald-300 mb-3">Profile</p>
                <h1 className="text-4xl font-bold mb-8">{user.username}</h1>

                {message && (
                    <p className="bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 rounded-md p-3 mb-4">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="bg-red-500/10 text-red-200 border border-red-500/30 rounded-md p-3 mb-4">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
                    <form onSubmit={saveProfile} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-fit">
                        <h2 className="text-2xl font-semibold mb-5">Contact Details</h2>
                        <label className="block text-sm text-zinc-300 mb-2" htmlFor="phone">
                            Phone
                        </label>
                        <input
                            id="phone"
                            value={profile.phone}
                            onChange={(event) => updateField('phone', event.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Phone number"
                        />
                        <label className="block text-sm text-zinc-300 mb-2" htmlFor="address">
                            Address
                        </label>
                        <textarea
                            id="address"
                            rows="5"
                            value={profile.address}
                            onChange={(event) => updateField('address', event.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Default delivery address"
                        />
                        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-md mt-5">
                            Save profile
                        </button>
                    </form>

                    <section>
                        <h2 className="text-2xl font-semibold mb-5">Recent Orders</h2>
                        {orders.length === 0 ? (
                            <p className="text-zinc-400">No orders yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-zinc-800 rounded-lg p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <h3 className="font-semibold">Order #{order.id}</h3>
                                            <span className="text-emerald-300">{order.status}</span>
                                        </div>
                                        <p className="text-zinc-400 mt-2">Total: Rs. {order.total_price}</p>
                                        <p className="text-zinc-500 text-sm mt-1">
                                            {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Profile;
