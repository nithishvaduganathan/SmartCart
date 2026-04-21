import React, { useContext, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const LandingPage = () => {
    const { api } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);

            try {
                const params = selectedCategory === 'all' ? {} : { category: selectedCategory };
                const [productRes, categoryRes] = await Promise.all([
                    api.get('products/', { params }),
                    api.get('categories/'),
                ]);
                setProducts(productRes.data);
                setCategories(categoryRes.data);
            } catch (error) {
                console.error('Failed to fetch catalog', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, [api, selectedCategory]);

    const filteredProducts = products.filter((product) => {
        const term = search.trim().toLowerCase();

        if (!term) {
            return true;
        }

        return (
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        );
    });

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <section className="relative overflow-hidden border-b border-zinc-800">
                <img
                    src={heroImage}
                    alt="Fresh products ready for delivery"
                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-zinc-950/75" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="max-w-3xl">
                        <p className="text-sm uppercase tracking-wide text-emerald-300 mb-4">
                            Smart shopping starts here
                        </p>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Find the products you need, then check out in minutes.
                        </h1>
                        <p className="max-w-2xl text-xl text-zinc-300 mb-8">
                            Browse the catalog, build your cart, and track every order from one account.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
                    <div>
                        <p className="text-emerald-300 text-sm uppercase tracking-wide">Catalog</p>
                        <h2 className="text-3xl font-bold mt-2">Featured Products</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search products"
                            className="bg-zinc-900 border border-zinc-700 rounded-md px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(event) => setSelectedCategory(event.target.value)}
                            className="bg-zinc-900 border border-zinc-700 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="all">All categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900 rounded-lg border border-zinc-800">
                        <p className="text-xl text-zinc-400">No products available at the moment.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default LandingPage;
