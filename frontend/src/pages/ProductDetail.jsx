import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await api.get(`products/${id}/`);
                setProduct(res.data);
                if (res.data.category) {
                    const allProducts = await api.get('products/', { params: { category: res.data.category.slug } });
                    const data = Array.isArray(allProducts.data) ? allProducts.data : (allProducts.data.results || []);
                    setRelatedProducts(data.filter(p => p.id !== res.data.id).slice(0, 4));
                }
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id, api]);

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        setAddingToCart(true);
        try {
            for (let i = 0; i < quantity; i++) await addToCart(product.id);
            setCartMessage(`${quantity} item(s) added to cart`);
            setTimeout(() => setCartMessage(''), 2500);
        } catch { setCartMessage('Failed to add'); }
        finally { setAddingToCart(false); }
    };

    const handleBuyNow = async () => {
        if (!user) { navigate('/login'); return; }
        setAddingToCart(true);
        try {
            for (let i = 0; i < quantity; i++) await addToCart(product.id);
            navigate('/cart');
        } catch { setCartMessage('Failed'); }
        finally { setAddingToCart(false); }
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error || !product) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '18px', color: '#212121', marginBottom: '16px' }}>{error || 'Product not found'}</p>
                <button onClick={() => navigate('/products')} style={{ background: '#2874f0', color: '#fff', padding: '10px 24px', border: 'none', borderRadius: '3px', fontWeight: 600 }}>
                    Browse Products
                </button>
            </div>
        </div>
    );

    const price = Number(product.price);
    const originalPrice = Math.round(price * 1.3);
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    const rating = (4.0 + (product.id % 10) * 0.1).toFixed(1);

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <Link to="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <Link to="/products" style={{ color: '#878787', textDecoration: 'none' }}>Products</Link>
                    {product.category && <><span>›</span><Link to={`/products?category=${product.category.slug}`} style={{ color: '#878787', textDecoration: 'none' }}>{product.category.name}</Link></>}
                    <span>›</span>
                    <span style={{ color: '#212121' }}>{product.name}</span>
                </div>

                <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '24px' }}>
                    <div className="product-detail-layout">
                        {/* Left — Image */}
                        <div className="product-detail-image-container">
                            <div style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                background: '#fafafa',
                                marginBottom: '16px',
                            }}>
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ color: '#b0b0b0', fontSize: '16px' }}>No Image Available</div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    style={{
                                        flex: 1, padding: '14px 0', background: product.stock === 0 ? '#e0e0e0' : '#ff9f00',
                                        color: '#fff', border: 'none', borderRadius: '3px', fontSize: '16px', fontWeight: 600,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <ShoppingCart size={20} />
                                    {addingToCart ? 'ADDING...' : 'ADD TO CART'}
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={addingToCart || product.stock === 0}
                                    style={{
                                        flex: 1, padding: '14px 0', background: product.stock === 0 ? '#e0e0e0' : '#fb641b',
                                        color: '#fff', border: 'none', borderRadius: '3px', fontSize: '16px', fontWeight: 600,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    <Truck size={20} />
                                    BUY NOW
                                </button>
                            </div>

                            {cartMessage && (
                                <div style={{
                                    marginTop: '12px', padding: '10px 16px', borderRadius: '3px',
                                    background: cartMessage.includes('Failed') ? '#fff0f0' : '#e8f5e9',
                                    color: cartMessage.includes('Failed') ? '#d32f2f' : '#2e7d32',
                                    fontSize: '14px', fontWeight: 500,
                                }}>{cartMessage}</div>
                            )}
                        </div>

                        {/* Right — Details */}
                        <div>
                            {product.category && (
                                <span style={{ fontSize: '12px', color: '#2874f0', fontWeight: 500 }}>
                                    {product.category.name}
                                </span>
                            )}
                            <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#212121', marginTop: '4px', marginBottom: '12px', lineHeight: 1.4 }}>
                                {product.name}
                            </h1>

                            {/* Rating */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    background: '#388e3c', color: '#fff', fontSize: '13px', fontWeight: 600,
                                    padding: '3px 8px', borderRadius: '3px',
                                }}>
                                    {rating} <Star size={11} fill="#fff" stroke="#fff" />
                                </span>
                                <span style={{ fontSize: '13px', color: '#878787', fontWeight: 500 }}>
                                    {Math.floor(50 + product.id * 17 % 500)} Ratings & {Math.floor(10 + product.id * 7 % 100)} Reviews
                                </span>
                            </div>

                            <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600, marginBottom: '8px' }}>
                                Special Price
                            </p>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '28px', fontWeight: 700, color: '#212121' }}>
                                    ₹{price.toLocaleString('en-IN')}
                                </span>
                                <span style={{ fontSize: '16px', color: '#878787', textDecoration: 'line-through' }}>
                                    ₹{originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span style={{ fontSize: '16px', color: '#388e3c', fontWeight: 500 }}>
                                    {discount}% off
                                </span>
                            </div>

                            {/* Quantity */}
                            {product.stock > 0 && (
                                <div style={{ marginBottom: '20px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#212121', marginRight: '16px' }}>Quantity</span>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '6px 12px', background: '#f1f3f6', border: 'none', cursor: 'pointer' }}>
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ padding: '6px 20px', fontSize: '14px', fontWeight: 500, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>
                                            {quantity}
                                        </span>
                                        <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} style={{ padding: '6px 12px', background: '#f1f3f6', border: 'none', cursor: 'pointer' }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stock */}
                            {product.stock > 0 ? (
                                <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 500, marginBottom: '20px' }}>
                                    In Stock ({product.stock} available)
                                </p>
                            ) : (
                                <p style={{ fontSize: '14px', color: '#ff6161', fontWeight: 600, marginBottom: '20px' }}>
                                    Currently Out of Stock
                                </p>
                            )}

                            {/* Highlights */}
                            <div style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>Available Offers</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {[
                                        'Bank Offer: 10% off on SBI Credit Cards',
                                        'Special Offer: Get extra ₹100 off on orders above ₹999',
                                        'Free delivery on all prepaid orders',
                                    ].map((offer, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px', color: '#212121' }}>
                                            <span style={{ color: '#388e3c', fontWeight: 700, flexShrink: 0 }}>●</span>
                                            {offer}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Services */}
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {[
                                    { icon: <Truck size={20} color="#2874f0" />, label: 'Free Delivery' },
                                    { icon: <RotateCcw size={20} color="#2874f0" />, label: '7 Day Returns' },
                                    { icon: <Shield size={20} color="#2874f0" />, label: 'Secure Payment' },
                                ].map((s) => (
                                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {s.icon}
                                        <span style={{ fontSize: '12px', color: '#878787', fontWeight: 500 }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>Description</h3>
                                <p style={{ fontSize: '14px', color: '#212121', lineHeight: 1.7 }}>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div style={{
                        marginTop: '16px', background: '#fff', borderRadius: '4px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '20px',
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212121', marginBottom: '16px' }}>
                            Similar Products
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
