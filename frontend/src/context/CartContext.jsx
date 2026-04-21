/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const getCartTotal = (items) => (
    items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0)
);

export const CartProvider = ({ children }) => {
    const { api, token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setCartTotal(0);
            return;
        }

        try {
            const res = await api.get('cart/');

            if (res.data && res.data.items) {
                setCartItems(res.data.items);
                setCartTotal(getCartTotal(res.data.items));
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
        }
    }, [api, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (productId) => {
        if (!token) {
            return { ok: false, reason: 'auth' };
        }

        try {
            const existingItem = cartItems.find((item) => item.product.id === productId);

            if (existingItem) {
                await api.patch(`cart-items/${existingItem.id}/`, {
                    quantity: existingItem.quantity + 1,
                });
            } else {
                await api.post('cart-items/', { product_id: productId, quantity: 1 });
            }

            await fetchCart();
            return { ok: true };
        } catch (error) {
            console.error('Failed to add to cart', error);
            return { ok: false, reason: 'request' };
        }
    }, [api, cartItems, fetchCart, token]);

    const updateQuantity = useCallback(async (cartItemId, quantity) => {
        if (!token) {
            return;
        }

        try {
            if (quantity < 1) {
                await api.delete(`cart-items/${cartItemId}/`);
            } else {
                await api.patch(`cart-items/${cartItemId}/`, { quantity });
            }

            await fetchCart();
        } catch (error) {
            console.error('Failed to update cart item', error);
        }
    }, [api, fetchCart, token]);

    const removeFromCart = useCallback(async (cartItemId) => {
        try {
            await api.delete(`cart-items/${cartItemId}/`);
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart', error);
        }
    }, [api, fetchCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setCartTotal(0);
    }, []);

    const value = useMemo(() => ({
        cartItems,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
    }), [addToCart, cartItems, cartTotal, clearCart, fetchCart, removeFromCart, updateQuantity]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
