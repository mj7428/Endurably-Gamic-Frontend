import React from 'react';

const StatCard = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-4">
        <div className="bg-red-600/20 p-2 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-md font-bold text-white">{value}</p>
        </div>
    </div>
);

const StatsWidget = () => {
    // In a real app, you would fetch this data from the backend
    const stats = {
        pendingBases: 5, // Placeholder
        totalUsers: 128, // Placeholder
        activeTournaments: 2 // Placeholder
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Pending Submissions" value={stats.pendingBases} icon={<span className="text-2xl">📥</span>} />
            <StatCard title="Total Users" value={stats.totalUsers} icon={<span className="text-2xl">👥</span>} />
            <StatCard title="Active Tournaments" value={stats.activeTournaments} icon={<span className="text-2xl">🏆</span>} />
        </div>
    );
};

export default StatsWidget;

