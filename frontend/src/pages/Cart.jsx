import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Cart() {
    const { user, api } = useContext(AuthContext);
    const { cartItems, cartTotal, updateQuantity, removeFromCart, fetchCart } = useContext(CartContext);
    const [shippingAddress, setShippingAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const placeOrder = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!shippingAddress.trim()) {
            setError('Enter a shipping address before placing your order.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('orders/', {
                shipping_address: shippingAddress.trim(),
            });
            await fetchCart();
            setShippingAddress('');
            setMessage(`Order #${response.data.id} placed successfully.`);
        } catch (err) {
            setError(err.response?.data?.error || 'Unable to place the order.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 max-w-md text-center">
                    <h1 className="text-3xl font-bold mb-3">Your cart is waiting</h1>
                    <p className="text-zinc-400 mb-6">Login to add products, review your cart, and checkout.</p>
                    <Link to="/login" className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-md">
                        Login to continue
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col gap-2 mb-8">
                    <p className="text-sm uppercase tracking-wide text-emerald-300">Checkout</p>
                    <h1 className="text-4xl font-bold">Shopping Cart</h1>
                </div>

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

                {cartItems.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-zinc-400 mb-6">Add a few products before checkout.</p>
                        <Link to="/" className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-md">
                            Shop products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
                                >
                                    <div className="h-24 w-24 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                                        {item.product.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-semibold truncate">{item.product.name}</h2>
                                        <p className="text-zinc-400 mt-1">Rs. {item.product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="h-9 w-9 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="h-9 w-9 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="h-9 w-9 rounded-md text-red-300 hover:bg-red-500/10 flex items-center justify-center"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={placeOrder} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-fit">
                            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between text-zinc-300 mb-2">
                                <span>Items</span>
                                <span>{cartItems.length}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t border-zinc-800 pt-4 mt-4">
                                <span>Total</span>
                                <span>Rs. {cartTotal.toFixed(2)}</span>
                            </div>

                            <label className="block mt-6 mb-2 text-sm font-medium text-zinc-300" htmlFor="shipping">
                                Shipping address
                            </label>
                            <textarea
                                id="shipping"
                                rows="4"
                                value={shippingAddress}
                                onChange={(event) => setShippingAddress(event.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="House number, street, city, state, pincode"
                            />

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-md mt-5 disabled:opacity-60"
                            >
                                {submitting ? 'Placing order...' : 'Place order'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
