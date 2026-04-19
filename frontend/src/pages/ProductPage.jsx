import React, { useState, useEffect, useMemo } from 'react';

const ProductPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [cartCount, setCartCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const productsData = [
        { id: 1, name: 'boAt Rockerz 450 Wireless Headphones Pro', price: 2999, mrp: 3999, discount: 25, rating: 4.3, reviews: 12450, category: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', description: 'Active Noise Cancellation, 20hr Battery, Bluetooth 5.0' },
        { id: 2, name: 'Noise ColorFit Pro 4 Smart Watch Ultra', price: 4999, mrp: 6999, discount: 28, rating: 4.1, reviews: 8920, category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', description: 'AMOLED Display, GPS, SpO2, 100+ Sports Modes' },
        { id: 3, name: 'Logitech G502 Gaming Mouse RGB', price: 1499, mrp: 2499, discount: 40, rating: 4.6, reviews: 15670, category: 'Gaming', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', description: '16000 DPI, 11 Buttons, RGB Lights, Adjustable Weight' },
        { id: 4, name: 'Redgear MK881 Mechanical Keyboard', price: 3499, mrp: 4999, discount: 30, rating: 4.4, reviews: 9340, category: 'Gaming', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', description: 'Blue Switches, RGB Backlit, Anti-Ghosting, 104 Keys' },
        { id: 5, name: 'JBL Flip 5 Portable Bluetooth Speaker', price: 1999, mrp: 2999, discount: 33, rating: 4.5, reviews: 23450, category: 'Audio', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', description: 'IPX7 Waterproof, 12hr Playtime, PartyBoost' },
        { id: 6, name: 'Anker PowerWave Wireless Charger 15W', price: 899, mrp: 1499, discount: 40, rating: 4.2, reviews: 6780, category: 'Accessories', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', description: 'Fast Charge, Case Friendly, LED Indicator' },
        { id: 7, name: 'OnePlus Buds Z2 Bluetooth Earbuds', price: 2499, mrp: 3999, discount: 37, rating: 4.3, reviews: 11230, category: 'Audio', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', description: 'ANC, 38hr Battery, Dolby Atmos, IP55' },
        { id: 8, name: 'Cosmic Byte RGB Laptop Cooling Pad', price: 1299, mrp: 1999, discount: 35, rating: 4.0, reviews: 4560, category: 'Gaming', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', description: '5 Fans, 7 Height Adjust, Blue LED' },
      ];
      setAllProducts(productsData);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allProducts;
    if (searchText) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [allProducts, searchText, category, sortBy]);

  const suggestions = useMemo(() => {
    if (!searchText) return [];
    return allProducts.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase())).slice(0, 5);
  }, [searchText, allProducts]);

  const handleAddToCart = (productName) => {
    setCartCount(cartCount + 1);
    alert(`${productName} added to Cart! 🛒 Total: ${cartCount + 1}`);
  };

  const categories = ['All', 'Audio', 'Wearables', 'Gaming', 'Accessories'];

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px' }}>Loading deals...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      {/* Search Bar */}
      <div style={{ backgroundColor: '#2874f0', padding: '12px 0' }}>
        <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{
                  width: '100%',
                  padding: '10px 50px 10px 16px',
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '2px',
                  outline: 'none'
                }}
              />
              <button style={{
                position: 'absolute',
                right: '0',
                top: '0',
                height: '100%',
                padding: '0 20px',
                backgroundColor: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}>🔍</button>

              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '42px',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #dbdbdb',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 100
                }}>
                  {suggestions.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { setSearchText(s.name); setShowSuggestions(false); }}
                      style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      🔍 {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
              🛒 Cart ({cartCount})
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0', padding: '12px 0' }}>
        <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '32px' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: category === c ? '600' : '500',
                color: category === c ? '#2874f0' : '#212121',
                cursor: 'pointer',
                padding: '8px 0',
                borderBottom: category === c ? '2px solid #2874f0' : 'none'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '20px' }}>
        {/* Sort Bar */}
        <div style={{ backgroundColor: 'white', padding: '12px 20px', marginBottom: '16px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>Sort By</span>
          <button onClick={() => setSortBy('default')} style={{ background: 'none', border: 'none', color: sortBy === 'default' ? '#2874f0' : '#212121', fontWeight: sortBy === 'default' ? '600' : '400', cursor: 'pointer' }}>Relevance</button>
          <button onClick={() => setSortBy('rating')} style={{ background: 'none', border: 'none', color: sortBy === 'rating' ? '#2874f0' : '#212121', fontWeight: sortBy === 'rating' ? '600' : '400', cursor: 'pointer' }}>Popularity</button>
          <button onClick={() => setSortBy('price-low')} style={{ background: 'none', border: 'none', color: sortBy === 'price-low' ? '#2874f0' : '#212121', fontWeight: sortBy === 'price-low' ? '600' : '400', cursor: 'pointer' }}>Price -- Low to High</button>
          <button onClick={() => setSortBy('price-high')} style={{ background: 'none', border: 'none', color: sortBy === 'price-high' ? '#2874f0' : '#212121', fontWeight: sortBy === 'price-high' ? '600' : '400', cursor: 'pointer' }}>Price -- High to Low</button>
          <span style={{ marginLeft: 'auto', fontSize: '14px', color: '#878787' }}>{filteredProducts.length} results</span>
        </div>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{
              backgroundColor: 'white',
              padding: '16px',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'contain', marginBottom: '12px' }} />
              
              <div style={{ fontSize: '14px', color: '#878787', marginBottom: '6px' }}>{product.category}</div>
              <h3 style={{ fontSize: '16px', color: '#212121', marginBottom: '8px', lineHeight: '1.4', minHeight: '45px' }}>{product.name}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ backgroundColor: '#388e3c', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '12px', fontWeight: '600' }}>
                  {product.rating} ★
                </div>
                <span style={{ fontSize: '14px', color: '#878787' }}>({product.reviews.toLocaleString()})</span>
              </div>

              <p style={{ fontSize: '14px', color: '#212121', marginBottom: '12px', minHeight: '40px' }}>{product.description}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: '600', color: '#212121' }}>₹{product.price.toLocaleString()}</span>
                <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString()}</span>
                <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: '600' }}>{product.discount}% off</span>
              </div>

              <button
                onClick={() => handleAddToCart(product.name)}
                style={{
                  width: '100%',
                  backgroundColor: '#ff9f00',
                  color: 'white',
                  padding: '12px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;