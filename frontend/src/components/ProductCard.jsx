import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login', {
                state: { message: 'Sign in to add products to your cart.' },
            });
            return;
        }

        const result = await addToCart(product.id);
        setStatus(result.ok ? 'Added' : 'Try again');
        window.setTimeout(() => setStatus(''), 1600);
    };

    return (
        <div
            className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-lg"
        >
            <div className="h-48 bg-zinc-800 relative">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white truncate pr-4">{product.name}</h3>
                    <span className="text-xl font-bold text-emerald-400">Rs. {product.price}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{product.description}</p>
                
                <button 
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-md transition-colors duration-200"
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{status || 'Add to Cart'}</span>
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
