import React, { useState, useEffect } from 'react';
import martService from '../services/martService';

// Helper component for a modern toggle switch
const Toggle = ({ label, enabled, setEnabled }) => (
    <label className="flex items-center cursor-pointer">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <div className={`block w-14 h-8 rounded-full ${enabled ? 'bg-red-600' : 'bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-3 text-gray-300 font-medium">{label}</div>
    </label>
);

const CreateItemModal = ({ isOpen, onClose, onSuccess, categories }) => {
    // State for all the professional fields
    const [sku, setSku] = useState('');
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [weightKg, setWeightKg] = useState('');
    const [dimensions, setDimensions] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset form state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setSku('');
            setName('');
            setShortDescription('');
            setLongDescription('');
            setPrice('');
            setSalePrice('');
            setStockQuantity(0);
            setIsActive(true);
            setIsFeatured(false);
            setWeightKg('');
            setDimensions('');
            setImageFile(null);
            setImageUrl('');
            setCategoryId(categories[0]?.id || '');
            setError('');
        }
    }, [isOpen, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Step 1: Handle Image Upload
        let finalImageUrl = imageUrl;
        if (imageFile) {
            try {
                const uploadResponse = await martService.uploadImage(imageFile);
                finalImageUrl = uploadResponse.data.imageUrl;
            } catch (err) {
                setError('Image upload failed. Please try again.');
                setLoading(false);
                return;
            }
        }
        
        if (!finalImageUrl) {
             setError('An image is required. Please upload one or provide a URL.');
             setLoading(false);
             return;
        }

        // Step 2: Construct Final Item Data
        const itemData = {
            sku, name, shortDescription, longDescription,
            price: parseFloat(price),
            salePrice: salePrice ? parseFloat(salePrice) : null,
            stockQuantity: parseInt(stockQuantity),
            isActive, isFeatured, weightKg: weightKg ? parseFloat(weightKg) : null,
            dimensions, imageUrl: finalImageUrl, categoryId
        };

        // Step 3: Create the Item
        try {
            await martService.createItem(itemData);
            onSuccess(); 
            onClose();   
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create item. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg lg:max-w-4xl relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-10">&times;</button>
                <h3 className="text-2xl font-bold text-white mb-6">Add New Item</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* --- Left Column --- */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2 mb-4">Basic Information</h4>
                                <div className="space-y-4">
                                    <input type="text" placeholder="SKU (Unique ID)" value={sku} onChange={e => setSku(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                                    <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                                    <textarea placeholder="Short Description (for item cards)" value={shortDescription} onChange={e => setShortDescription(e.target.value)} rows="2" className="w-full p-2 bg-gray-700 rounded"></textarea>
                                    <textarea placeholder="Long Description (for item detail page)" value={longDescription} onChange={e => setLongDescription(e.target.value)} rows="4" className="w-full p-2 bg-gray-700 rounded"></textarea>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2 mb-4">Image & Category</h4>
                                <div className="space-y-4">
                                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full p-2 bg-gray-700 rounded">
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    <input type="file" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700" />
                                    <input type="url" placeholder="Or paste Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column --- */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2 mb-4">Pricing & Inventory</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" className="w-full p-2 bg-gray-700 rounded" />
                                    <input type="number" placeholder="Sale Price (₹)" value={salePrice} onChange={e => setSalePrice(e.target.value)} min="0" step="0.01" className="w-full p-2 bg-gray-700 rounded" />
                                    <input type="number" placeholder="Stock" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} required min="0" className="w-full p-2 bg-gray-700 rounded" />
                                </div>
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2 mb-4">Shipping</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="number" placeholder="Weight (kg)" value={weightKg} onChange={e => setWeightKg(e.target.value)} min="0" step="0.001" className="w-full p-2 bg-gray-700 rounded" />
                                    <input type="text" placeholder="Dimensions (cm)" value={dimensions} onChange={e => setDimensions(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 border-b border-gray-700 pb-2 mb-4">Visibility</h4>
                                <div className="flex justify-around pt-2">
                                    <Toggle label="Active" enabled={isActive} setEnabled={setIsActive} />
                                    <Toggle label="Featured" enabled={isFeatured} setEnabled={setIsFeatured} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-700 mt-6">
                        {error && <p className="text-sm text-red-400 text-center mb-4">{error}</p>}
                        <div className="flex justify-end space-x-4">
                           <button type="button" onClick={onClose} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                           <button type="submit" disabled={loading} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-500">
                               {loading ? 'Adding Item...' : 'Add Item to Mart'}
                           </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;

