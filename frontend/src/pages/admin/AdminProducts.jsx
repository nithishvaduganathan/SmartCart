import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ChevronLeft, X, Box } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { isAdminUser } from '../../utils/admin';

const AdminProducts = () => {
    const { user, api } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [savingCategory, setSavingCategory] = useState(false);

    useEffect(() => {
        if (!isAdminUser(user)) { navigate('/'); return; }
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([api.get('products/'), api.get('categories/')]);
            const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.results || []);
            const catData = Array.isArray(catRes.data) ? catRes.data : (catRes.data.results || []);
            setProducts(prodData);
            setCategories(catData);
        } catch { console.error('Failed to load'); }
        finally { setLoading(false); }
    };

    const openNew = () => {
        setEditProduct(null);
        setForm({ name: '', description: '', price: '', stock: '', category_id: categories[0]?.id || '', image_url: '' });
        setShowForm(true); setError('');
        setShowNewCategoryForm(false);
        setNewCategoryName('');
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name, description: product.description,
            price: product.price, stock: product.stock,
            category_id: product.category?.id || '', image_url: product.image_url || '',
        });
        setShowForm(true); setError('');
        setShowNewCategoryForm(false);
        setNewCategoryName('');
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        setSavingCategory(true);
        try {
            const res = await api.post('categories/', { name: newCategoryName });
            setCategories([...categories, res.data]);
            setForm({ ...form, category_id: res.data.id });
            setShowNewCategoryForm(false);
            setNewCategoryName('');
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to add category');
        } finally {
            setSavingCategory(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock), category_id: Number(form.category_id) };
            if (editProduct) {
                await api.put(`products/${editProduct.id}/`, payload);
            } else {
                await api.post('products/', payload);
            }
            await fetchData();
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save product');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.delete(`products/${id}/`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch { console.error('Failed to delete'); }
    };

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f3f6' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/admin/dashboard" style={{ color: '#2874f0', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <ChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#212121' }}>Manage Products</h1>
                            <p style={{ fontSize: '14px', color: '#878787' }}>{products.length} products</p>
                        </div>
                    </div>
                    <button onClick={openNew} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#2874f0', color: '#fff', padding: '10px 20px',
                        border: 'none', borderRadius: '3px', fontSize: '13px', fontWeight: 600,
                        cursor: 'pointer',
                    }}>
                        <Plus size={16} /> Add Product
                    </button>
                </div>

                {/* Product Form Modal */}
                {showForm && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <div style={{ background: '#fff', borderRadius: '4px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#878787' }}><X size={20} /></button>
                            </div>

                            {error && <div style={{ margin: '16px 24px 0', padding: '10px 16px', background: '#fce4ec', color: '#c62828', borderRadius: '4px', fontSize: '13px' }}>{error}</div>}

                            <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { key: 'name', label: 'Product Name', type: 'text' },
                                    { key: 'price', label: 'Price (₹)', type: 'number' },
                                    { key: 'stock', label: 'Stock', type: 'number' },
                                    { key: 'image_url', label: 'Image URL', type: 'url' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                                        <input
                                            type={field.type} value={form[field.key]}
                                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                                            required={field.key !== 'image_url'}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontSize: '14px', color: '#212121' }}
                                        />
                                    </div>
                                ))}

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <label style={{ fontSize: '12px', color: '#878787', display: 'block' }}>Category</label>
                                        <button type="button" onClick={() => setShowNewCategoryForm(!showNewCategoryForm)} style={{ background: 'none', border: 'none', color: '#2874f0', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                            {showNewCategoryForm ? 'Cancel' : '+ New Category'}
                                        </button>
                                    </div>
                                    {showNewCategoryForm ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input 
                                                type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
                                                placeholder="Enter new category name"
                                                style={{ flex: 1, padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontSize: '14px', color: '#212121' }}
                                            />
                                            <button type="button" onClick={handleAddCategory} disabled={savingCategory || !newCategoryName.trim()} style={{
                                                padding: '0 16px', background: '#2874f0', color: '#fff', border: 'none', borderRadius: '3px', fontWeight: 600, cursor: savingCategory || !newCategoryName.trim() ? 'not-allowed' : 'pointer', opacity: savingCategory || !newCategoryName.trim() ? 0.6 : 1
                                            }}>{savingCategory ? 'Adding...' : 'Add'}</button>
                                        </div>
                                    ) : (
                                        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                            style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontSize: '14px', color: '#212121' }}>
                                            <option value="">Select category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    )}
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '6px' }}>Description</label>
                                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows="4" required
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '3px', fontSize: '14px', color: '#212121', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
                                    <button type="button" onClick={() => setShowForm(false)} style={{
                                        padding: '10px 24px', border: '1px solid #e0e0e0', borderRadius: '3px',
                                        background: '#fff', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer',
                                    }}>Cancel</button>
                                    <button type="submit" disabled={saving} style={{
                                        padding: '10px 24px', border: 'none', borderRadius: '3px',
                                        background: '#2874f0', color: '#fff', fontSize: '14px', fontWeight: 600,
                                        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                                    }}>{saving ? 'Saving...' : 'Save'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Product Table */}
                <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#878787', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                                ) : (
                                                    <Box size={20} color="#b0b0b0" />
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {product.name}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#878787' }}>{product.category?.name || '—'}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600 }}>₹{Number(product.price).toLocaleString('en-IN')}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                fontSize: '13px', fontWeight: 600,
                                                color: product.stock > 0 ? '#388e3c' : '#ff6161',
                                            }}>{product.stock > 0 ? product.stock : 'Out of stock'}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => openEdit(product)} style={{
                                                    padding: '6px 12px', background: '#e8f0fe', border: 'none',
                                                    borderRadius: '3px', color: '#2874f0', fontSize: '12px', fontWeight: 600,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                                }}><Pencil size={12} /> Edit</button>
                                                <button onClick={() => handleDelete(product.id)} style={{
                                                    padding: '6px 12px', background: '#fce4ec', border: 'none',
                                                    borderRadius: '3px', color: '#c62828', fontSize: '12px', fontWeight: 600,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                                                }}><Trash2 size={12} /> Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {products.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <Box size={48} color="#b0b0b0" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: '#878787' }}>No products found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
