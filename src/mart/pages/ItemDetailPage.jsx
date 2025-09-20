import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import martService from '../services/martService';
import { useAuth } from '../../context/AuthContext';


// ============================================================================
// Main ItemDetailPage Component
// ============================================================================
const ItemDetailPage = () => {
    const { itemId } = useParams();
    const { user, setCart } = useAuth();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await martService.getItemById(itemId);
                setItem(response.data);
                setActiveImage(response.data.imageUrl); // Set the main image initially
            } catch (err) {
                setError('Item not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [itemId]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsAdding(true);
        try {
            const response = await martService.addItemToCart(item.id, quantity);
            setCart(response.data);
            // Here you could trigger a success notification
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-white">Loading Item...</div>;
    if (error) return <div className="text-center p-8 text-red-400">{error}</div>;
    if (!item) return null;

    const hasDiscount = item.salePrice && item.salePrice < item.price;
    
    // Placeholder for additional images for the gallery
    const imageGallery = [item.imageUrl, 'https://placehold.co/600x400/374151/FFFFFF?text=Angled', 'https://placehold.co/600x400/4A5568/FFFFFF?text=Side'];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <div className="text-sm text-gray-400 mb-4">
                <Link to="/mart" className="hover:text-red-400">Gamic Mart</Link> &gt; 
                <span className="font-semibold text-white"> {item.name}</span>
            </div>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* --- Image Gallery --- */}
                    <div>
                        <div className="mb-4 rounded-lg overflow-hidden shadow-md">
                            <img src={activeImage} alt={item.name} className="w-full h-auto object-contain aspect-square" />
                        </div>
                        <div className="flex space-x-2">
                            {imageGallery.map((imgUrl, index) => (
                                <button key={index} onClick={() => setActiveImage(imgUrl)} className={`w-1/4 rounded-md overflow-hidden border-2 ${activeImage === imgUrl ? 'border-red-500' : 'border-transparent'}`}>
                                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- Details & Actions --- */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{item.name}</h1>
                        <p className="text-gray-300 mb-4">{item.shortDescription}</p>

                        <div className="mb-6">
                            {hasDiscount ? (
                                <div className="flex items-baseline space-x-3">
                                    <p className="text-4xl font-bold text-red-400">₹{item.salePrice.toFixed(2)}</p>
                                    <p className="text-2xl text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                                </div>
                            ) : (
                                <p className="text-4xl font-bold text-red-400">₹{item.price.toFixed(2)}</p>
                            )}
                        </div>

                        {item.stockQuantity > 0 ? (
                            <p className="text-sm text-green-400 mb-6 font-semibold">In Stock ({item.stockQuantity > 10 ? "very few" : item.stockQuantity} available)</p>
                        ) : (
                            <p className="text-sm text-red-400 mb-6 font-semibold">Out of Stock</p>
                        )}
                        
                        {/* Action Panel */}
                        <div className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-4 mb-6">
                             <input 
                                type="number" 
                                value={quantity} 
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value)))} 
                                min="1" 
                                className="w-20 p-3 bg-gray-900 border border-gray-600 rounded text-center focus:ring-red-500 focus:border-red-500" 
                            />
                             <button 
                                onClick={handleAddToCart}
                                disabled={isAdding || item.stockQuantity === 0}
                                className="flex-grow bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>
                                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                            </button>
                            <button className="p-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 hover:text-red-400 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                            </button>
                        </div>
                        
                        {/* Full Description & Specs */}
                        <div className="mt-auto pt-6 border-t border-gray-700 space-y-6">
                             <div>
                                 <h3 className="font-bold text-white mb-2">Description</h3>
                                 <p className="text-gray-400 text-sm leading-relaxed">{item.longDescription}</p>
                             </div>
                             <div>
                                <h3 className="font-bold text-white mb-2">Specifications</h3>
                                <div className="text-sm space-y-1 text-gray-400">
                                    <p><strong>SKU:</strong> {item.sku}</p>
                                    {item.weightKg && <p><strong>Weight:</strong> {item.weightKg} kg</p>}
                                    {item.dimensions && <p><strong>Dimensions:</strong> {item.dimensions}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailPage;

