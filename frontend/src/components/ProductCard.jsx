import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const price = Number(product.price);
    const originalPrice = Math.round(price * 1.3);
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    const rating = 4.0 + Math.random() * 0.9;

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        const result = await addToCart(product.id);
        setStatus(result.ok ? 'Added!' : 'Error');
        setTimeout(() => setStatus(''), 1500);
    };

    return (
        <div
            onClick={() => navigate(`/products/${product.id}`)}
            style={{
                background: '#fff',
                borderRadius: '4px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
            }}
        >
            {/* Image */}
            <div style={{
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                overflow: 'hidden',
            }}>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s',
                        }}
                    />
                ) : (
                    <div style={{
                        width: '100%', height: '100%',
                        background: '#f5f5f5', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#b0b0b0', fontSize: '14px', borderRadius: '4px',
                    }}>No Image</div>
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Title */}
                <h3 style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#212121',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '8px',
                }}>
                    {product.name}
                </h3>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        background: '#388e3c',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '3px',
                    }}>
                        {rating.toFixed(1)} <Star size={10} fill="#fff" stroke="#fff" />
                    </span>
                    <span style={{ fontSize: '12px', color: '#878787', fontWeight: 500 }}>
                        ({Math.floor(Math.random() * 500 + 50)})
                    </span>
                </div>

                {/* Price */}
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>
                            ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span style={{
                            fontSize: '13px', color: '#878787',
                            textDecoration: 'line-through',
                        }}>
                            ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 500 }}>
                            {discount}% off
                        </span>
                    </div>

                    {/* Stock */}
                    {product.stock === 0 ? (
                        <p style={{ fontSize: '12px', color: '#ff6161', fontWeight: 500, marginTop: '6px' }}>
                            Out of Stock
                        </p>
                    ) : (
                        <p style={{ fontSize: '11px', color: '#388e3c', marginTop: '6px' }}>
                            Free delivery
                        </p>
                    )}
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '8px 0',
                        background: product.stock === 0 ? '#e0e0e0' : '#ff9f00',
                        color: product.stock === 0 ? '#878787' : '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                        if (product.stock > 0) e.currentTarget.style.background = '#e8910a';
                    }}
                    onMouseLeave={(e) => {
                        if (product.stock > 0) e.currentTarget.style.background = '#ff9f00';
                    }}
                >
                    <ShoppingCart size={14} />
                    {status || (product.stock === 0 ? 'Out of Stock' : 'ADD TO CART')}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
