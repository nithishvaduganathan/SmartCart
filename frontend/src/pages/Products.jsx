import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const PAGE_SIZE = 12;

const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
    { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
    { label: 'Above ₹10,000', min: 10000, max: Infinity },
];

function Products() {
    const { api } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setActiveCategory(cat);
        const s = searchParams.get('search');
        if (s) setSearch(s);
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productRes, categoryRes] = await Promise.all([
                    api.get('products/'),
                    api.get('categories/'),
                ]);
                const prodData = Array.isArray(productRes.data) ? productRes.data : (productRes.data.results || []);
                const catData = Array.isArray(categoryRes.data) ? categoryRes.data : (categoryRes.data.results || []);
                setProducts(prodData);
                setCategories(catData);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [api]);

    const visibleProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        const filtered = products.filter((product) => {
            const inCategory = activeCategory === 'all' || product.category?.slug === activeCategory;
            const inSearch = !query || product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query);
            const inPrice = !priceRange || (Number(product.price) >= priceRange.min && Number(product.price) <= priceRange.max);
            return inCategory && inSearch && inPrice;
        });
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
            if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        return sorted;
    }, [activeCategory, products, search, sortBy, priceRange]);

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
    const currentPageItems = visibleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => { setPage(1); }, [activeCategory, search, sortBy, priceRange]);

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px', display: 'flex', gap: '4px' }}>
                    <Link to="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
                    <span>›</span>
                    <span style={{ color: '#212121' }}>
                        {activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || 'Products'}
                    </span>
                    {search && <><span>›</span><span style={{ color: '#212121' }}>"{search}"</span></>}
                </div>

                <div className="products-layout">
                    {/* Sidebar Filters */}
                    <div className="products-sidebar" style={{
                        background: '#fff',
                        borderRadius: '4px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        display: showFilters ? 'block' : 'none',
                    }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>Filters</h3>
                        </div>

                        {/* Categories */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase', marginBottom: '12px' }}>
                                CATEGORIES
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                    <input type="radio" name="category" checked={activeCategory === 'all'} onChange={() => setActiveCategory('all')}
                                        style={{ accentColor: '#2874f0' }} />
                                    All Categories
                                </label>
                                {categories.map((cat) => (
                                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                        <input type="radio" name="category" checked={activeCategory === cat.slug} onChange={() => setActiveCategory(cat.slug)}
                                            style={{ accentColor: '#2874f0' }} />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
                            <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase', marginBottom: '12px' }}>
                                PRICE
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                    <input type="radio" name="price" checked={priceRange === null} onChange={() => setPriceRange(null)}
                                        style={{ accentColor: '#2874f0' }} />
                                    All Prices
                                </label>
                                {priceRanges.map((range) => (
                                    <label key={range.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                        <input type="radio" name="price" checked={priceRange?.label === range.label} onChange={() => setPriceRange(range)}
                                            style={{ accentColor: '#2874f0' }} />
                                        {range.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header Bar */}
                        <div style={{
                            background: '#fff',
                            borderRadius: '4px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            padding: '12px 16px',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>
                                    {activeCategory === 'all' ? 'All Products' : categories.find(c => c.slug === activeCategory)?.name || 'Products'}
                                </h2>
                                <span style={{ fontSize: '12px', color: '#878787' }}>
                                    (Showing {currentPageItems.length} of {visibleProducts.length} products)
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {/* Search in results */}
                                <div style={{ position: 'relative' }}>
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search in results..."
                                        style={{
                                            padding: '6px 12px 6px 32px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '3px',
                                            fontSize: '13px',
                                            width: '200px',
                                            color: '#212121',
                                            background: '#fff',
                                        }}
                                    />
                                    <Search size={14} color="#878787" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                </div>

                                {/* Sort */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#212121' }}>Sort By</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{
                                            padding: '6px 8px',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '3px',
                                            fontSize: '13px',
                                            color: '#212121',
                                            background: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-asc">Price — Low to High</option>
                                        <option value="price-desc">Price — High to Low</option>
                                        <option value="name">Name A-Z</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {loading ? (
                            <div style={{
                                background: '#fff', borderRadius: '4px', padding: '60px',
                                textAlign: 'center', color: '#878787',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', border: '3px solid #e0e0e0',
                                    borderTopColor: '#2874f0', borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite',
                                    margin: '0 auto 12px',
                                }} />
                                Loading products...
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : currentPageItems.length === 0 ? (
                            <div style={{
                                background: '#fff', borderRadius: '4px', padding: '60px',
                                textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                            }}>
                                <p style={{ fontSize: '18px', color: '#212121', fontWeight: 500, marginBottom: '8px' }}>
                                    No products found
                                </p>
                                <p style={{ fontSize: '14px', color: '#878787' }}>
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: '8px',
                                }}>
                                    {currentPageItems.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        marginTop: '24px',
                                        padding: '16px',
                                        background: '#fff',
                                        borderRadius: '4px',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                    }}>
                                        <button
                                            disabled={page <= 1}
                                            onClick={() => setPage(p => p - 1)}
                                            style={{
                                                padding: '8px 20px', border: '1px solid #e0e0e0',
                                                borderRadius: '3px', fontSize: '13px', fontWeight: 500,
                                                background: '#fff', color: page <= 1 ? '#b0b0b0' : '#2874f0',
                                                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                                            }}
                                        >PREVIOUS</button>
                                        <span style={{ fontSize: '13px', color: '#212121', padding: '0 16px' }}>
                                            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                                        </span>
                                        <button
                                            disabled={page >= totalPages}
                                            onClick={() => setPage(p => p + 1)}
                                            style={{
                                                padding: '8px 20px', border: '1px solid #e0e0e0',
                                                borderRadius: '3px', fontSize: '13px', fontWeight: 500,
                                                background: '#fff', color: page >= totalPages ? '#b0b0b0' : '#2874f0',
                                                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                                            }}
                                        >NEXT</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Products;
