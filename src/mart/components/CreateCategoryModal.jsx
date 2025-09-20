import React, { useState, useEffect } from 'react';
import martService from '../services/martService';

const CreateCategoryModal = ({ isOpen, onClose, onSuccess, categories }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const flattenCategories = (cats, prefix = '') => {
        console.log("categoreis are these ")
        if (!Array.isArray(cats)) {
            return []; 
        }
        let options = [];
        cats.forEach(cat => {
            options.push({ id: cat.id, name: `${prefix}${cat.name}` });
            if (cat.children && cat.children.length > 0) {
                options = [...options, ...flattenCategories(cat.children, `${prefix}- `)];
            }
        });
        console.log("falletern categories is this",options);
        return options;
    };

    const flatCategories = categories ? flattenCategories(categories) : [];

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
            setParentId('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const dataToSend = { name, description, parentId: parentId || null };
            await martService.createCategory(dataToSend);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to create category. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">Add New Category</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <textarea placeholder="Category Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" rows="3"></textarea>
                    
                    <div>
                        <label htmlFor="parent-category" className="block text-sm font-medium text-gray-300">Parent Category (Optional)</label>
                        <select id="parent-category" value={parentId} onChange={(e) => setParentId(e.target.value)} className="mt-1 w-full p-2 bg-gray-700 border border-gray-600 rounded-lg">
                            <option value="">-- No Parent (Top Level) --</option>
                            {flatCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-500">{loading ? 'Saving...' : 'Save Category'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryModal;

