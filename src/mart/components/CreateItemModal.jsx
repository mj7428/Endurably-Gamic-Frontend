import React, { useState } from 'react';
import martService from '../services/martService';

const CreateItemModal = ({ isOpen, onClose, onSuccess, categories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setError('Please select an image file.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await martService.createItem({ name, description, price: parseFloat(price), imageFile, categoryId });
            onSuccess(); 
            onClose();   
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create item.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                <h3 className="text-xl font-bold text-white mb-4">Add New Item</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Fields */}
                    <div>
                        <label htmlFor="item-name" className="block text-sm font-medium text-gray-300">Item Name</label>
                        <input id="item-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                     <div>
                        <label htmlFor="item-category" className="block text-sm font-medium text-gray-300">Category</label>
                        <select id="item-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="item-price" className="block text-sm font-medium text-gray-300">Price (₹)</label>
                        <input id="item-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="1" className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    {/* <div>
                        <label htmlFor="item-image" className="block text-sm font-medium text-gray-300">Image URL</label>
                        <input id="item-image" type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div> */}
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">Item Image</label>
                        <input type="file" id="image" onChange={(e) => setImageFile(e.target.files[0])} required accept="image/png, image/jpeg" className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700" />
                    </div>
                    <div>
                        <label htmlFor="item-desc" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea id="item-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-500">
                        {loading ? 'Adding...' : 'Add Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateItemModal;

