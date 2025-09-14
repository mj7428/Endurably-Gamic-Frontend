import React, { useState } from 'react';
import martService from '../services/martService';

const CreateCategoryModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await martService.createCategory({ name, description });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create category.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                <h3 className="text-xl font-bold text-white mb-4">Create New Category</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-300">Category Name</label>
                        <input
                            id="cat-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="cat-desc" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            id="cat-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-500">
                        {loading ? 'Creating...' : 'Create Category'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCategoryModal;

