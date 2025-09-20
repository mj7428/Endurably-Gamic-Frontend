import React, { useState, useEffect, useCallback, useRef } from 'react';
import martService from '../services/martService';
import { useAuth } from '../../context/AuthContext';
import CreateCategoryModal from '../components/CreateCategoryModal';
import CreateItemModal from '../components/CreateItemModal';
import HeroSlider from './HeroSlider';
import { Link } from 'react-router-dom';
import MobileCategoryDrawer from './MobileCategoryDrawer';

// ============================================================================
// NEW: Professional, Recursive Dropdown Component for Categories
// ============================================================================
const CategoryDropdownItem = ({ category, activeCategory, setActiveCategory, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    const handleCategoryClick = () => {
        setActiveCategory(category.id);
        if (hasChildren) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <li style={{ paddingLeft: `${level * 16}px` }}>
            <div className="flex items-center justify-between">
                <button
                    onClick={handleCategoryClick}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeCategory === category.id ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    {category.name}
                </button>
                {hasChildren && (
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-1">
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                )}
            </div>
            {/* If it has children and is open, render them recursively */}
            {hasChildren && isOpen && (
                <ul className="mt-1">
                    {category.children.map(child => (
                        <CategoryDropdownItem
                            key={child.id}
                            category={child}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};


// ============================================================================
// Updated CategorySidebar to use the new dropdown component
// ============================================================================
const CategorySidebar = ({ categories, activeCategory, setActiveCategory }) => (
    <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
        <ul className="space-y-1">
            <li>
                <button 
                    onClick={() => setActiveCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${!activeCategory ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                    All Items
                </button>
            </li>
            {categories.map(cat => (
                 <CategoryDropdownItem 
                    key={cat.id}
                    category={cat}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            ))}
        </ul>
    </div>
);

const ItemCard = React.forwardRef(({ item }, ref) => {
    const { user, setCart } = useAuth();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e) => {
        e.preventDefault();
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
    
    const hasDiscount = item.salePrice && item.salePrice < item.price;
    const isOutOfStock = item.stockQuantity <= 0;

    return (
        <div ref={ref} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50 flex flex-col justify-between group relative">
            
            <Link to={`/mart/items/${item.id}`} className="flex flex-col justify-between flex-grow">
                {isOutOfStock && (
                    <div className="group absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-xs border-2 border-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:border-red-500">
                            OUT OF STOCK
                        </span>
                    </div>
                )}
                <div className={isOutOfStock ? 'opacity-50' : ''}>
                    <div className="relative">
                        <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-48 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/1F2937/FFFFFF?text=Item`; }}
                        />
                         {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">SALE</div>
                        )}
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-white truncate group-hover:text-red-400 transition-colors">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 h-8 line-clamp-2">{item.shortDescription}</p>
                    </div>
                </div>
                <div className={`p-4 space-y-4 border-t border-gray-700/50 ${isOutOfStock ? 'opacity-50' : ''}`}>
                    {/* Price Display */}
                    <div className="flex items-center text-gray-400">
                         <div className="flex-grow border-t border-red-500/30"></div>
                         <div className="px-3 py-1 border border-gray-600 rounded-md mx-2">
                             {hasDiscount ? (
                                 <div className="flex items-baseline space-x-2">
                                     <p className="text-lg font-bold text-red-400">₹{item.salePrice.toFixed(2)}</p>
                                     <p className="text-xs text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                                 </div>
                             ) : (
                                 <p className="text-lg font-bold text-red-400">₹{item.price.toFixed(2)}</p>
                             )}
                         </div>
                         <div className="flex-grow border-t border-red-500/30"></div>
                     </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                        className="w-full bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {isOutOfStock ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
                    </button>
                </div>
            </Link>
        </div>
    );
});

const ItemCardSkeleton = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
        <div className="bg-gray-700 w-full h-48 animate-pulse"></div>
        <div className="p-4">
            <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4 border-t border-gray-700/50">
             <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
             <div className="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
        </div>
    </div>
);


const AdminActions = ({ onAddCategory, onAddItem }) => (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <button onClick={onAddItem} className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 transition-transform hover:scale-110" title="Add New Item">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" /></svg>
        </button>
        <button onClick={onAddCategory} className="bg-gray-700 text-white rounded-full p-3 shadow-lg hover:bg-gray-600 transition-transform hover:scale-110" title="Add New Category">
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
    const [loading, setLoading] = useState(false); 
    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true); 
    
    const [error, setError] = useState('');
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [isItemModalOpen, setItemModalOpen] = useState(false);

    const [isMobileCategoryOpen, setMobileCategoryOpen] = useState(false);

    const observer = useRef();
    const lastItemElementRef = useCallback(node => {
        if (loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore]);

    useEffect(() => {
        martService.getAllCategories()
            .then(res => setCategories(res.data))
            .catch(() => setError('Failed to load categories.'))
            .finally(() => setInitialLoading(false));
    }, []);

    useEffect(() => {
        if (initialLoading) return;
        setItems([]);
        setPage(0);
        setHasMore(true);
        
        const fetchItems = async () => {
            setLoadingItems(true);
            setError('');
            try {
                const fetchFunction = activeCategory
                    ? martService.getItemsByCategory(activeCategory, { page: 0, size: 12 })
                    : martService.getAllItems({ page: 0, size: 12 });
                
                const response = await fetchFunction;
                setItems(response.data.content || []);
                setHasMore(!response.data.last);
            } catch (err) {
                setError('Failed to load items.');
                setItems([]);
            } finally {
                setLoadingItems(false);
            }
        };
        fetchItems();
    }, [activeCategory, initialLoading]);
    
    useEffect(() => {
        if (page === 0) return;
        setLoadingMore(true);
        
        const fetchFunction = activeCategory
            ? martService.getItemsByCategory(activeCategory, { page, size: 12 })
            : martService.getAllItems({ page, size: 12 });
            
        fetchFunction.then(response => {
            setItems(prevItems => [...prevItems, ...response.data.content]);
            setHasMore(!response.data.last);
        }).catch(() => {
            setError('Failed to load more items.');
        }).finally(() => {
            setLoadingMore(false);
        });
    }, [page, activeCategory]);

    const refreshData = () => {

        martService.getAllCategories()
           .then(res => setCategories(res.data))
           .catch(() => setError('Failed to refresh categories.'));

        setActiveCategory(null);
    };

    const handleMobileCategorySelect = (categoryId) => {
        setActiveCategory(categoryId);
        setMobileCategoryOpen(false); 
    };

    const activeCategoryName = activeCategory 
        ? categories.flatMap(c => [c, ...(c.children || [])]).find(c => c.id === activeCategory)?.name 
        : 'All Items';

    if (initialLoading) return <p className="text-center text-xl p-8">Loading Gamic Mart...</p>;
    if (error && items.length === 0) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;
    
    return (
        <div className="container mx-auto px-4 py-8">
            <CreateCategoryModal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)} onSuccess={refreshData} categories={categories} />
            <CreateItemModal isOpen={isItemModalOpen} onClose={() => setItemModalOpen(false)} onSuccess={refreshData} categories={categories} />
            
            {/* NEW: Pass mobile-specific handler to the drawer */}
            <MobileCategoryDrawer 
                isOpen={isMobileCategoryOpen}
                onClose={() => setMobileCategoryOpen(false)}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={handleMobileCategorySelect}
            />

            {isAdmin && <AdminActions onAddCategory={() => setCategoryModalOpen(true)} onAddItem={() => setItemModalOpen(true)} />}

            <HeroSlider />

            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                <div className="hidden md:block md:col-span-1 lg:col-span-1">
                    <CategorySidebar categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                </div>
                <div className="md:col-span-3 lg:col-span-4">

                    {/* =============================================================== */}
                    {/* NEW: Mobile Category Trigger Button, replaces horizontal scroll */}
                    {/* =============================================================== */}
                    <div className="md:hidden mb-6">
                        <button 
                            onClick={() => setMobileCategoryOpen(true)}
                            className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors"
                        >
                            <span><span className="text-red-400">{activeCategoryName || 'Categories'}</span></span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>

                    {loadingItems ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <ItemCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item, index) => (
                                    items.length === index + 1
                                        ? <ItemCard ref={lastItemElementRef} key={item.id} item={item} />
                                        : <ItemCard key={item.id} item={item} />
                                ))}
                            </div>
                            
                            {loadingMore && <p className="text-center text-gray-400 mt-8">Loading more items...</p>}
                            {!hasMore && items.length > 0 && <p className="text-center text-gray-500 mt-8">You've reached the end.</p>}
                            {items.length === 0 && !loadingMore && (
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

