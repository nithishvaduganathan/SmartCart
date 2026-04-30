import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, ChevronDown, Package, Heart, LayoutDashboard, ClipboardList, Box } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { isAdminUser } from '../utils/admin';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const isAdmin = isAdminUser(user);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Main Navbar */}
            <nav style={{
                background: '#93f028ff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
                <div className="responsive-nav-inner">
                    {/* Logo */}
                    <Link to="/" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#fff',
                            fontStyle: 'italic',
                            letterSpacing: '-0.5px',
                            lineHeight: 1.1,
                        }}>SmartCart</span>
                        <span style={{
                            fontSize: '10px',
                            color: '#ffe500',
                            fontStyle: 'italic',
                            fontWeight: 500,
                        }}>Explore <span style={{ fontSize: '11px' }}>Plus</span> ⁺</span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="responsive-nav-search">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products, brands and more"
                            style={{
                                width: '100%',
                                padding: '9px 44px 9px 16px',
                                border: 'none',
                                borderRadius: '3px',
                                fontSize: '14px',
                                color: '#212121',
                                background: '#fff',
                                outline: 'none',
                            }}
                        />
                        <button type="submit" style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#2874f0',
                            padding: '4px',
                            display: 'flex',
                        }}>
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Right Actions */}
                    <div className="nav-right-actions">
                        {/* User / Login */}
                        {user ? (
                            <div ref={dropdownRef} style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'none',
                                        color: '#fff',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '8px 12px',
                                        borderRadius: '3px',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.background = showDropdown ? 'rgba(255,255,255,0.1)' : 'none'}
                                >
                                    <User size={18} />
                                    <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {user.username || user.user?.username}
                                    </span>
                                    <ChevronDown size={14} />
                                </button>

                                {showDropdown && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        marginTop: '4px',
                                        background: '#fff',
                                        borderRadius: '4px',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                        minWidth: '220px',
                                        overflow: 'hidden',
                                        zIndex: 200,
                                    }}>
                                        <Link to="/profile" onClick={() => setShowDropdown(false)} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 16px', color: '#212121', fontSize: '14px',
                                            textDecoration: 'none', transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <User size={16} color="#2874f0" /> My Profile
                                        </Link>
                                        <Link to="/profile" onClick={() => setShowDropdown(false)} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 16px', color: '#212121', fontSize: '14px',
                                            textDecoration: 'none', transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Package size={16} color="#2874f0" /> Orders
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/admin/dashboard" onClick={() => setShowDropdown(false)} style={{
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                padding: '12px 16px', color: '#212121', fontSize: '14px',
                                                textDecoration: 'none', transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <LayoutDashboard size={16} color="#2874f0" /> Admin Panel
                                            </Link>
                                        )}
                                        <div style={{ height: '1px', background: '#e0e0e0' }} />
                                        <button onClick={handleLogout} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '12px 16px', color: '#212121', fontSize: '14px',
                                            width: '100%', textAlign: 'left', background: 'none',
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={16} color="#ff6161" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                background: '#fff',
                                color: '#2874f0',
                                padding: '6px 32px',
                                fontSize: '14px',
                                fontWeight: 600,
                                borderRadius: '3px',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                            }}>Login</Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                            padding: '8px 12px',
                            borderRadius: '3px',
                            position: 'relative',
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ position: 'relative' }}>
                                <ShoppingCart size={20} />
                                {cartItems.length > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-10px',
                                        background: '#ff6161',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {cartItems.length}
                                    </span>
                                )}
                            </div>
                            <span className="hidden md:inline">Cart</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Category Strip */}
            <div style={{
                background: '#fff',
                borderBottom: '1px solid #e0e0e0',
                overflowX: 'auto',
                scrollbarWidth: 'none', // For Firefox
            }}>
                <style>{`
                    .cat-strip::-webkit-scrollbar { display: none; }
                `}</style>
                <div className="cat-strip" style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0',
                    padding: '0 16px',
                }}>
                    {[
                        { label: 'All', path: '/products' },
                        { label: 'Electronics', path: '/products?category=electronics' },
                        { label: 'Fashion', path: '/products?category=fashion' },
                        { label: 'Home', path: '/products?category=home' },
                        { label: 'Sports', path: '/products?category=sports' },
                        { label: 'Books', path: '/products?category=books' },
                        { label: 'Toys', path: '/products?category=toys' },
                    ].map((cat) => (
                        <Link
                            key={cat.label}
                            to={cat.path}
                            style={{
                                padding: '12px 20px',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#212121',
                                whiteSpace: 'nowrap',
                                textDecoration: 'none',
                                borderBottom: '2px solid transparent',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#2874f0';
                                e.currentTarget.style.borderBottomColor = '#2874f0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#212121';
                                e.currentTarget.style.borderBottomColor = 'transparent';
                            }}
                        >
                            {cat.label}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
