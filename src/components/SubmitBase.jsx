import React, { useState, useEffect, useRef, useCallback } from 'react';
import baseLayoutService from '../services/baseLayoutService';

const MiniBaseCard = ({ layout }) => (
    <div className="bg-gray-700 rounded-lg p-3 flex items-center space-x-4 transition-transform hover:scale-105">
        <img 
            src={`${layout.imageUrl}`} 
            alt={layout.title} 
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/374151/FFFFFF?text=Img`; }}
        />
        <div className="overflow-hidden">
            <h4 className="font-semibold text-white truncate">{layout.title}</h4>
            <p className="text-sm text-gray-400">TH {layout.townhallLevel}</p>
        </div>
    </div>
);

const SubmitBase = () => {
    const [title, setTitle] = useState('');
    const [townhallLevel, setTownhallLevel] = useState('');
    const [baseLink, setBaseLink] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [myBases, setMyBases] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingBases, setIsLoadingBases] = useState(false);
    const [listVersion, setListVersion] = useState(0);

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
        const fetchMyBases = async () => {
            setIsLoadingBases(true);
            try {
                const response = await baseLayoutService.getMyBases(page, 5);
                
                if (page === 0) {
                    setMyBases(response.data.content);
                } else {
                    setMyBases(prevBases => [...prevBases, ...response.data.content]);
                }
                console.log("------------------------response ---------------",!response.data.last);
                setHasMore(!response.data.last);
            } catch (err) {
                console.error("Failed to fetch user's bases", err);
            } finally {
                setIsLoadingBases(false);
            }
        };
        if (hasMore) {
            console.log("------------------------checking has more ---------------",hasMore);
            fetchMyBases();
        }
    }, [page, listVersion]);

    // Handler for the form submission
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
            setFormSuccess('Base layout submitted successfully!');
            
            setTitle('');
            setTownhallLevel('');
            setBaseLink('');
            setImageFile(null);
            e.target.reset();
            
            setPage(0);
            setHasMore(true);
            setListVersion(v => v + 1); 

        } catch (err) {
            setFormError('Submission failed. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                
                <div className="md:sticky top-8 h-fit">
                   <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Submit a New Base</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="townhallLevel" className="block text-sm font-medium text-gray-300">Town Hall Level</label>
                                <input type="number" id="townhallLevel" value={townhallLevel} onChange={(e) => setTownhallLevel(e.target.value)} required min="1" max="17" className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="baseLink" className="block text-sm font-medium text-gray-300">Base Link</label>
                                <input type="url" id="baseLink" value={baseLink} onChange={(e) => setBaseLink(e.target.value)} required className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                            </div>
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image Screenshot</label>
                                <input type="file" id="image" onChange={(e) => setImageFile(e.target.files[0])} required accept="image/png, image/jpeg" className="mt-1 w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                            </div>
                            
                            {formError && <p className="text-sm text-red-400 text-center">{formError}</p>}
                            {formSuccess && <p className="text-sm text-green-400 text-center">{formSuccess}</p>}
                            
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-all">
                                {isSubmitting ? 'Submitting...' : 'Submit Base'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <h3 className="text-xl font-bold text-white">Your Submissions</h3>
                    {myBases.map((base, index) => {
                        if (myBases.length === index + 1) {
                            return <div ref={lastBaseElementRef} key={base.id}><MiniBaseCard layout={base} /></div>;
                        } else {
                            return <MiniBaseCard key={base.id} layout={base} />;
                        }
                    })}
                    {isLoadingBases && <p className="text-center text-gray-400">Loading more...</p>}
                    {!hasMore && myBases.length > 0 && <p className="text-center text-gray-500">You've reached the end.</p>}
                    {myBases.length === 0 && !isLoadingBases && <p className="text-center text-gray-500">You haven't submitted any bases yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default SubmitBase;
