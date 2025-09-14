import React from 'react';
import { useNavigate } from 'react-router-dom';

const TournamentAdminWidget = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-md font-bold text-white">Tournament Management</h2>
            <p className="text-sm text-gray-400">
                Create and manage official tournaments for the community.
            </p>
            <button
                onClick={() => navigate('/tournaments/create')}
                className="w-full bg-red-600 text-sm text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors"
            >
                + Create New Tournament
            </button>
        </div>
    );
};

export default TournamentAdminWidget;

