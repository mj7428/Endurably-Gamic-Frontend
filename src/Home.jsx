import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import BaseLayoutGrid from './components/BaseLayoutGrid';
import RelevantVideos from './components/RelevantVideos';
import RecentVideos from './components/RecentVideos';
import baseLayoutService from './services/baseLayoutService';

const HomePage = () => {
    const [layouts, setLayouts] = useState([]);
    const [activeTownHall, setActiveTownHall] = useState(15);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const observer = useRef();
    const lastBaseElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        setLayouts([]);
        setPage(0);
        setHasMore(true);
    }, [activeTownHall]);

    useEffect(() => {
        if (!hasMore && page > 0) return;

        const fetchLayouts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await baseLayoutService.getAll({ page, size: 8 }, activeTownHall);
                setLayouts(prev => page === 0 ? response.data.content : [...prev, ...response.data.content]);
                setHasMore(!response.data.last);
            } catch (err) {
                setError('Failed to fetch base layouts. Is the server running?');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLayouts();
    }, [page, activeTownHall]);

    return (
        <>
            <Header activeTownHall={activeTownHall} setActiveTownHall={setActiveTownHall} />
            <div className="container mx-auto px-2 sm:px-4 py-8">
                <BaseLayoutGrid 
                    layouts={layouts} 
                    loading={loading} 
                    error={error} 
                    lastBaseElementRef={lastBaseElementRef}
                />
                <RelevantVideos 
                    searchTerm={`TH${activeTownHall} Attack Strategy`} 
                    title={`TH${activeTownHall} Attack Strategies`}
                />
                <RecentVideos />
                {error && <div className="text-center text-red-500 mt-4">{error}</div>}
            </div>
        </>
    );
};

export default HomePage;

