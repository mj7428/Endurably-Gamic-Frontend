import React, { useState, useEffect, useRef, useCallback } from 'react';
import baseLayoutService from '../services/baseLayoutService';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// Helper Component for Status Badges
// ============================================================================
const StatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-500/20 text-yellow-400',
        APPROVED: 'bg-green-500/20 text-green-400',
        REJECTED: 'bg-red-500/20 text-red-400',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-500/20 text-gray-400'}`}>
            {status}
        </span>
    );
};

// ============================================================================
// Redesigned Card for Submissions (with Admin Actions)
// ============================================================================
const SubmissionCard = ({ layout, isAdmin, onApprove, onReject }) => (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-4">
        <img 
            src={layout.imageUrl} 
            alt={layout.title} 
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/374151/FFFFFF?text=Img`; }}
        />
        <div className="flex-grow min-w-0">
            <h4 className="font-semibold text-white truncate">{layout.title}</h4>
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-400">TH {layout.townhallLevel}</p>
                <StatusBadge status={layout.status} />
            </div>
        </div>
        {isAdmin && layout.status === 'PENDING' && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                <button onClick={() => onApprove(layout.id)} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-700">Approve</button>
                <button onClick={() => onReject(layout.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-700">Reject</button>
            </div>
        )}
    </div>
);

// ============================================================================
// Main SubmitBase Component
// ============================================================================
const SubmitBase = () => {
    const { user } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    // Form State
    const [title, setTitle] = useState('');
    const [townhallLevel, setTownhallLevel] = useState('');
    const [baseLink, setBaseLink] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List State
    const [bases, setBases] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingBases, setIsLoadingBases] = useState(true);
    const [listVersion, setListVersion] = useState(0);
    const [filterMode, setFilterMode] = useState('myBases');

    const observer = useRef();
    const lastBaseElementRef = useCallback(node => {
        if (isLoadingBases) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoadingBases, hasMore]);

    useEffect(() => {
        if (!hasMore && page > 0) return;
        setIsLoadingBases(true);

        const fetchBases = async () => {
            try {
                const fetchFunction = filterMode === 'pending' 
                    ? baseLayoutService.getPendingBases 
                    : baseLayoutService.getMyBases;
                
                const response = await fetchFunction(page, 5);
                setBases(prev => page === 0 ? response.data.content : [...prev, ...response.data.content]);
                setHasMore(!response.data.last);
            } catch (err) {
                console.error("Failed to fetch bases", err);
            } finally {
                setIsLoadingBases(false);
            }
        };
        fetchBases();
    }, [page, listVersion, filterMode]);

    useEffect(() => {
        setBases([]);
        setPage(0);
        setHasMore(true);
    }, [filterMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setFormError('Please select an image file.');
            return;
        }
        setFormError('');
        setFormSuccess('');
        setIsSubmitting(true);

        try {
            await baseLayoutService.createBase(title, townhallLevel, baseLink, imageFile);
            setFormSuccess('Base submitted for review!');
            setTitle(''); setTownhallLevel(''); setBaseLink(''); setImageFile(null);
            e.target.reset();
            setListVersion(v => v + 1);
        } catch (err) {
            setFormError('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (baseId) => {
        await baseLayoutService.approveBase(baseId);
        setBases(prev => prev.filter(base => base.id !== baseId));
    };

    const handleReject = async (baseId) => {
        if (window.confirm("Are you sure you want to reject this base?")) {
            await baseLayoutService.rejectBase(baseId);
            setBases(prev => prev.filter(base => base.id !== baseId));
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="md:sticky top-24 h-fit">
                    <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Submit a New Base</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="townhallLevel" className="block text-sm font-medium text-gray-300">Town Hall Level</label>
                                <input type="number" id="townhallLevel" value={townhallLevel} onChange={(e) => setTownhallLevel(e.target.value)} required min="1" max="17" className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="baseLink" className="block text-sm font-medium text-gray-300">Base Link</label>
                                <input type="url" id="baseLink" value={baseLink} onChange={(e) => setBaseLink(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image Screenshot</label>
                                <input type="file" id="image" onChange={(e) => setImageFile(e.target.files[0])} required accept="image/png, image/jpeg" className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700" />
                            </div>
                            
                            {formError && <p className="text-sm text-red-400 text-center">{formError}</p>}
                            {formSuccess && <p className="text-sm text-green-400 text-center">{formSuccess}</p>}
                            
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-500 transition-all">
                                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    {isAdmin && (
                        <div className="bg-gray-800 p-2 rounded-lg flex space-x-2">
                            <button onClick={() => setFilterMode('myBases')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${filterMode === 'myBases' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>My Submissions</button>
                            <button onClick={() => setFilterMode('pending')} className={`flex-1 py-2 text-sm font-semibold rounded-md ${filterMode === 'pending' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Pending Review</button>
                        </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-white">{filterMode === 'pending' ? 'Pending Submissions' : 'Your Submissions'}</h3>
                    
                    {bases.map((base, index) => {
                        const card = <SubmissionCard key={base.id} layout={base} isAdmin={isAdmin} onApprove={handleApprove} onReject={handleReject} />;
                        if (bases.length === index + 1) {
                            return <div ref={lastBaseElementRef} key={base.id}>{card}</div>;
                        }
                        return card;
                    })}

                    {isLoadingBases && <p className="text-center text-gray-400">Loading...</p>}
                    {!hasMore && bases.length > 0 && <p className="text-center text-gray-500">You've reached the end.</p>}
                    {bases.length === 0 && !isLoadingBases && <p className="text-center text-gray-500">{filterMode === 'pending' ? 'The review queue is empty.' : "You haven't submitted any bases yet."}</p>}
                </div>
            </div>
        </div>
    );
};

export default SubmitBase;
