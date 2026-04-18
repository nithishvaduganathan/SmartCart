import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
        >
            <div className="h-48 bg-gray-700 relative">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white truncate pr-4">{product.name}</h3>
                    <span className="text-xl font-bold text-indigo-400">${product.price}</span>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                
                <button 
                    onClick={() => addToCart(product.id)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition-colors duration-200"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
