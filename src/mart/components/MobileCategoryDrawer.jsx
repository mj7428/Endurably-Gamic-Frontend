import React from 'react';

// We can reuse the same sidebar component you already built!
const CategorySidebar = ({ categories, activeCategory, setActiveCategory }) => (
    <div className="bg-gray-800 p-4 h-full">
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

// We'll need to pass the CategoryDropdownItem component down or import it here.
// For simplicity in this example, I'm assuming it's available.
// In a real app, you would import it: import CategoryDropdownItem from './CategoryDropdownItem';
const CategoryDropdownItem = ({ category, activeCategory, setActiveCategory, level = 0 }) => {
 const [isOpen, setIsOpen] = React.useState(false);
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
             <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
           </button>
         )}
       </div>
       {hasChildren && isOpen && (
         <ul className="mt-1">
  {category.children.map(child => (<CategoryDropdownItem key={child.id} category={child} activeCategory={activeCategory} setActiveCategory={setActiveCategory} level={level + 1} />))}
 </ul>
)}
 </li>
 );
};


const MobileCategoryDrawer = ({ isOpen, onClose, categories, activeCategory, setActiveCategory }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop Overlay */}
            <div 
                className="fixed inset-0 bg-black/60 transition-opacity" 
                aria-hidden="true"
                onClick={onClose}
            ></div>

            {/* Sliding Drawer */}
            <div className={`fixed inset-y-0 left-0 flex w-full max-w-xs transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-full bg-gray-900 shadow-xl flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">Filter Categories</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    {/* Reuse the existing CategorySidebar component here */}
                    <CategorySidebar
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />
                </div>
            </div>
        </div>
    );
};

export default MobileCategoryDrawer;
