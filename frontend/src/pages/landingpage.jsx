import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Truck, Shield, RotateCcw, Headphones, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const bannerSlides = [
    {
        title: 'Big Savings Days',
        subtitle: 'Up to 80% OFF on Electronics, Fashion & More!',
        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cta: 'Shop Now',
    },
    {
        title: 'Fashion Mega Sale',
        subtitle: 'Flat 50-70% OFF on Top Brands',
        bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        cta: 'Explore',
    },
    {
        title: 'Electronics Festival',
        subtitle: 'Best Deals on Smartphones, Laptops & Gadgets',
        bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        cta: 'Buy Now',
    },
];

const categoryItems = [
    { name: 'Electronics', slug: 'electronics', emoji: '📱' },
    { name: 'Fashion', slug: 'fashion', emoji: '👕' },
    { name: 'Home & Living', slug: 'home', emoji: '🏠' },
    { name: 'Sports', slug: 'sports', emoji: '⚽' },
    { name: 'Books', slug: 'books', emoji: '📚' },
    { name: 'Toys & Games', slug: 'toys', emoji: '🧸' },
];

const LandingPage = () => {
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('products/');
                const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    // Auto-advance banner
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const featuredProducts = products.slice(0, 8);
    const dealsProducts = products.slice(0, 4);

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            {/* Hero Banner Carousel */}
            <div style={{
                position: 'relative',
                height: '280px',
                overflow: 'hidden',
            }}>
                {bannerSlides.map((slide, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: slide.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            color: '#fff',
                            transition: 'opacity 0.6s ease, transform 0.6s ease',
                            opacity: idx === currentSlide ? 1 : 0,
                            transform: idx === currentSlide ? 'scale(1)' : 'scale(1.05)',
                        }}
                    >
                        <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
                            {slide.title}
                        </h1>
                        <p style={{ fontSize: '18px', fontWeight: 300, marginBottom: '24px', textAlign: 'center', opacity: 0.9 }}>
                            {slide.subtitle}
                        </p>
                        <button
                            onClick={() => navigate('/products')}
                            style={{
                                background: '#fff',
                                color: '#2874f0',
                                padding: '12px 40px',
                                borderRadius: '3px',
                                fontSize: '15px',
                                fontWeight: 600,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.15s',
                            }}
                        >
                            {slide.cta} →
                        </button>
                    </div>
                ))}

                {/* Dots */}
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '8px',
                }}>
                    {bannerSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            style={{
                                width: idx === currentSlide ? '24px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                background: idx === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)',
                                border: 'none',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </div>

                {/* Nav Arrows */}
                <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
                    style={{
                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                ><ChevronLeft size={20} color="#212121" /></button>
                <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
                    style={{
                        position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                ><ChevronRight size={20} color="#212121" /></button>
            </div>

            {/* Categories Strip */}
            <div style={{
                maxWidth: '1400px',
                margin: '20px auto 0',
                padding: '0 16px',
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-around',
                    overflowX: 'auto',
                }}>
                    {categoryItems.map((cat) => (
                        <Link
                            key={cat.slug}
                            to={`/products?category=${cat.slug}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                minWidth: '100px',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                        >
                            <span style={{ fontSize: '36px' }}>{cat.emoji}</span>
                            <span style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#212121',
                                whiteSpace: 'nowrap',
                            }}>{cat.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Deals of the Day */}
            <div style={{ maxWidth: '1400px', margin: '20px auto 0', padding: '0 16px' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    padding: '20px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#212121' }}>
                                Deals of the Day
                            </h2>
                            <Zap size={20} color="#ff9f00" fill="#ff9f00" />
                        </div>
                        <Link
                            to="/products"
                            style={{
                                background: '#2874f0',
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: '3px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >VIEW ALL</Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#878787' }}>
                            Loading deals...
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '16px',
                        }}>
                            {dealsProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Trust Badges */}
            <div style={{ maxWidth: '1400px', margin: '20px auto', padding: '0 16px' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    textAlign: 'center',
                }}>
                    {[
                        { icon: <Truck size={28} color="#2874f0" />, title: 'Free Delivery', desc: 'On orders above ₹499' },
                        { icon: <RotateCcw size={28} color="#2874f0" />, title: 'Easy Returns', desc: '7-day return policy' },
                        { icon: <Shield size={28} color="#2874f0" />, title: 'Secure Payment', desc: '100% secure checkout' },
                        { icon: <Headphones size={28} color="#2874f0" />, title: '24/7 Support', desc: 'Dedicated customer help' },
                    ].map((badge) => (
                        <div key={badge.title} style={{
                            padding: '24px 16px',
                            borderRight: '1px solid #f0f0f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            {badge.icon}
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>{badge.title}</span>
                            <span style={{ fontSize: '12px', color: '#878787' }}>{badge.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Products */}
            <div style={{ maxWidth: '1400px', margin: '0 auto 20px', padding: '0 16px' }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    padding: '20px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                    }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#212121' }}>
                            Top Products for You
                        </h2>
                        <Link
                            to="/products"
                            style={{
                                background: '#2874f0',
                                color: '#fff',
                                padding: '8px 20px',
                                borderRadius: '3px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >VIEW ALL</Link>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#878787' }}>
                            Loading products...
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '16px',
                        }}>
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LandingPage;
