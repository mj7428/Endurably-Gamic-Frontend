import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const EditBaseModal = ({ isOpen, onClose, base, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [townhallLevel, setTownhallLevel] = useState('');
    const [baseLink, setBaseLink] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (base) {
            setTitle(base.title);
            setTownhallLevel(base.townhallLevel);
            setBaseLink(base.baseLink);
            setImageUrl(base.imageUrl);
        }
    }, [base]);

    if (!isOpen || !base) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const updateData = { title, townhallLevel, baseLink, imageUrl };
            await adminService.patchBaseLayout(base.id, updateData);
            onUpdate(); // Trigger a refresh on the parent component
            onClose();
        } catch (err) {
            setError('Failed to update base. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-lg w-full">
                <h2 className="text-xl font-bold text-white mb-4">Edit Base Layout</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields for editing */}
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                    <input type="number" value={townhallLevel} onChange={e => setTownhallLevel(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                    <input type="url" value={baseLink} onChange={e => setBaseLink(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-red-600 px-4 py-2 rounded">{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBaseModal;
