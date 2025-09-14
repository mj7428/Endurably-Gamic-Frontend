import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';
import EditBaseModal from '../components/EditBaseModal';

const PendingBasesWidget = () => {
    const [pendingBases, setPendingBases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBase, setEditingBase] = useState(null);

    const fetchPending = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getPendingBases(0, 10);
            setPendingBases(response.data.content);
        } catch (error) {
            console.error("Failed to fetch pending bases", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleAction = async (action, baseId) => {
        try {
            if (action === 'approve') {
                await adminService.approveBase(baseId);
            } else {
                await adminService.rejectBase(baseId);
            }
            fetchPending(); 
        } catch (error) {
            console.error(`Failed to ${action} base`, error);
        }
    };

    return (
        <>
            <EditBaseModal 
                isOpen={!!editingBase} 
                onClose={() => setEditingBase(null)} 
                base={editingBase}
                onUpdate={fetchPending}
            />
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-md font-bold text-white mb-4">Bases Pending Review</h2>
                {loading ? (
                    <p className="text-gray-400">Loading submissions...</p>
                ) : pendingBases.length > 0 ? (
                    <div className="space-y-4">
                        {pendingBases.map(base => (
                            <div key={base.id} className="bg-gray-700 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex-grow text-center sm:text-left">
                                    <p className="font-semibold text-sm text-white truncate">{base.title}</p>
                                    <p className="text-sm text-gray-400">TH{base.townhallLevel} by {base.submittedByUsername}</p>
                                </div>
                                <div className="flex space-x-2 flex-shrink-0">
                                    <button onClick={() => setEditingBase(base)} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-700">Edit</button>
                                    <button onClick={() => handleAction('approve', base.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700">Approve</button>
                                    <button onClick={() => handleAction('reject', base.id)} className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">The review queue is empty. Great job!</p>
                )}
            </div>
        </>
    );
};

export default PendingBasesWidget;

