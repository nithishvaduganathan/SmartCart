import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { api, token } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCartItems([]);
            setCartTotal(0);
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const res = await api.get('cart/');
            if(res.data && res.data.items) {
                setCartItems(res.data.items);
                calculateTotal(res.data.items);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await api.post('cart-items/', { product_id: productId, quantity: 1 });
            fetchCart();
        } catch (error) {
            console.error("Failed to add to cart", error);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            await api.delete(`cart-items/${cartItemId}/`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove from cart", error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setCartTotal(0);
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
        setCartTotal(total);
    };

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, addToCart, removeFromCart, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
