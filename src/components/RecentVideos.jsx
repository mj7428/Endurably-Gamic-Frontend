import React, { useState, useEffect } from 'react';
import youtubeService from '../services/youtubeService';

const RecentVideos = () => {
    const [videoIds, setVideoIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecentVideos = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await youtubeService.getRecentVideos();
                setVideoIds(response.data);
            } catch (err) {
                console.error("Failed to fetch recent YouTube videos:", err);
                setError('Could not load live videos. Showing our top picks instead!');
                setVideoIds(["ZC6Ks4sT7q4", "EtEp4sXYzBA", "jpghzKDEifE"]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentVideos();
    }, []);

    if (loading) {
        return (
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-4">Latest Videos</h3>
                <p className="text-gray-400">Loading latest videos from our channel...</p>
            </div>
        );
    }

    if (videoIds.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">Latest Videos from Our Channel</h3>

            {error && <p className="text-yellow-400 text-sm mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoIds.map(videoId => (
                    <div key={videoId} className="aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentVideos;
