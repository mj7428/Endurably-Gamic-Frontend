import React, { useState } from 'react';
import martService from '../services/martService';

const AddAddressModal = ({ isOpen, onClose, onAddressAdded }) => {
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('India');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);
        try {
            const addressData = { street, city, state, zipCode, country };
            const response = await martService.addAddress(addressData);
            onAddressAdded(response.data);
            onClose();
        } catch (err) {
            setError("Failed to add address. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">Add New Address</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Street Address" value={street} onChange={e => setStreet(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="State / Province" value={state} onChange={e => setState(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="Zip / Postal Code" value={zipCode} onChange={e => setZipCode(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="Country" value={country} onChange={e => setCountry(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" disabled={isSaving} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-500">
                            {isSaving ? 'Saving...' : 'Save Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
