import React, { useState, useEffect, useCallback } from 'react';
import martService from '../services/martService';
import { useAuth } from '../../context/AuthContext';
import CreateCategoryModal from '../components/CreateCategoryModal';
import CreateItemModal from '../components/CreateItemModal';
import HeroSlider from './HeroSlider';

// ============================================================================
// Helper Components (specific to this page)
// ============================================================================

const HeroSection = () => (
    // <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 mb-8 text-center">
    //     <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome to the Gamic Mart</h1>
    //     <p className="text-lg text-gray-400">Your one-stop shop for premium in-game items and assets.</p>
    // </div>
    <HeroSlider/>
);

const CategorySidebar = ({ categories, activeCategory, setActiveCategory }) => (
    <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
        <ul className="space-y-2">
            <li>
                <button 
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${!activeCategory ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    All Items
                </button>
            </li>
            {categories.map(cat => (
                <li key={cat.id}>
                    <button 
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                    >
                        {cat.name}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

const ItemCard = ({ item }) => {
    const { user, setCart } = useAuth();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!user) {
            alert("Please log in to add items to your cart.");
            return;
        }
        setIsAdding(true);
        try {
            const response = await martService.addItemToCart(item.id, 1);
            setCart(response.data);
        } catch (error) {
            console.error("Failed to add item to cart", error);
        } finally {
            setIsAdding(false);
        }
    };
    
    // Placeholder for discount logic. You can drive this from your API later.
    const hasDiscount = true; // Set to true to see the discount UI
    const originalPrice = item.price * 1.25; // Example: 25% discount

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50 flex flex-col justify-between group">
            <div>
                {/* Image Section with Wishlist Button */}
                <div className="relative">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Item`; }}
                    />
                    <button className="absolute top-2 right-2 bg-gray-900/50 p-2 rounded-full text-white hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path></svg>
                    </button>
                    {hasDiscount && (
                         <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                           SALE
                        </div>
                    )}
                </div>

                {/* Title and Description */}
                <div className="p-4">
                    <h4 className="font-bold text-white truncate group-hover:text-red-400 transition-colors">{item.name}</h4>
                    <p className="text-sm text-gray-400 mt-1 h-10 line-clamp-2">{item.description}</p>
                </div>
            </div>

            {/* Price and Action Section */}
            <div className="p-4 space-y-4 border-t border-gray-700/50">
                {/* ✅ NEW: Professional Price Display with decorative border */}
                <div className="flex items-center text-gray-400">
                    <div className="flex-grow border-t border-red-500"></div>
                    <div className="px-3 py-1 border border-red-500 rounded-md mx-2">
                        {hasDiscount ? (
                            <div className="flex items-baseline space-x-2">
                                <p className="text-lg font-bold text-red-400">₹{item.price.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 line-through">₹{originalPrice.toFixed(2)}</p>
                            </div>
                        ) : (
                            <p className="text-lg font-bold text-red-400">₹{item.price.toFixed(2)}</p>
                        )}
                    </div>
                    <div className="flex-grow border-t border-red-500"></div>
                </div>
                
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

const AdminActions = ({ onAddCategory, onAddItem }) => (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <button onClick={onAddItem} className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition-transform hover:scale-110">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
        </button>
        <button onClick={onAddCategory} className="bg-gray-700 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 transition-transform hover:scale-110">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
        </button>
    </div>
);

// ============================================================================
// Main MartHomePage Component
// ============================================================================
const MartHomePage = () => {
    const { user } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isItemModalOpen, setItemModalOpen] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await martService.getAllCategories();
            setCategories(response.data);
        } catch (err) {
            setError('Failed to load categories.');
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = activeCategory
                    ? await martService.getItemsByCategory(activeCategory, { page: 0, size: 12 })
                    : await martService.getAllItems({ page: 0, size: 12 });
                
                setItems(response.data.content || []);
                setHasMore(!response.data.last);
                setPage(0);
            } catch (err) {
                setError('Failed to load items.');
                setItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [activeCategory]);

    // This would be for infinite scroll, which can be added later
    // const observer = useRef();
    // const lastItemElementRef = useCallback(...)

    const refreshData = () => {
        fetchCategories(); // This will trigger the item fetch effect
    };

    if (error && categories.length === 0) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;
    
    return (
        <div className="container mx-auto px-4 py-8">
            <CreateCategoryModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} onSuccess={refreshData} />
            <CreateItemModal isOpen={isItemModalOpen} onClose={() => setItemModalOpen(false)} onSuccess={refreshData} categories={categories} />
            
            {isAdmin && <AdminActions onAddCategory={() => setCategoryModalOpen(true)} onAddItem={() => setItemModalOpen(true)} />}

            <HeroSection />

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {/* Sidebar */}
                <div className="hidden md:block md:col-span-1 lg:col-span-1">
                    <CategorySidebar categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 lg:col-span-4">
                    {/* Mobile Category Filter */}
                    <div className="md:hidden flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                         <button onClick={() => setActiveCategory(null)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${!activeCategory ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                            All Items
                        </button>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Item Grid */}
                    {loading ? (
                        <div className="text-center text-gray-400 p-8">Loading items...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map(item => <ItemCard key={item.id} item={item} />)}
                            </div>
                            
                            {items.length === 0 && (
                                <div className="text-center bg-gray-800 p-8 rounded-lg mt-6">
                                    <p className="text-gray-400">No items found in this category yet.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MartHomePage;

