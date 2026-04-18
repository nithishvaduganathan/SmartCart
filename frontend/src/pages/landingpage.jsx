import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { api } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('products/');
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">E-Commerce</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-10">
                            Discover premium products with a seamless, dynamic, and beautiful shopping experience.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800 rounded-xl border border-gray-700">
                        <p className="text-xl text-gray-400">No products available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;