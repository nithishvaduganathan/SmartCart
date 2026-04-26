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
    const [discountCode, setDiscountCode] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

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
                const total = getCartTotal(res.data.items);
                setCartTotal(total);
                // Reset discount when cart changes
                setDiscountCode(null);
                setDiscountAmount(0);
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
                await api.put(`cart-items/${existingItem.id}/`, {
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
                await api.put(`cart-items/${cartItemId}/`, { quantity });
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
        setDiscountCode(null);
        setDiscountAmount(0);
    }, []);

    const applyDiscount = useCallback(async (code) => {
        try {
            const response = await api.post('discounts/validate/', {
                code: code.toUpperCase(),
                order_amount: cartTotal
            });

            if (response.data) {
                setDiscountCode(response.data.code);
                setDiscountAmount(response.data.discount_amount);
                return { ok: true, message: 'Discount applied successfully', data: response.data };
            }
        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Invalid discount code';
            setDiscountCode(null);
            setDiscountAmount(0);
            return { ok: false, message: errorMsg };
        }
    }, [api, cartTotal]);

    const removeDiscount = useCallback(() => {
        setDiscountCode(null);
        setDiscountAmount(0);
    }, []);

    const finalTotal = cartTotal - discountAmount;

    const value = useMemo(() => ({
        cartItems,
        cartTotal,
        discountCode,
        discountAmount,
        finalTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        applyDiscount,
        removeDiscount,
    }), [addToCart, cartItems, cartTotal, discountCode, discountAmount, finalTotal, clearCart, fetchCart, removeFromCart, updateQuantity, applyDiscount, removeDiscount]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
