import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

const TournamentCard = ({ tournament, onViewDetails }) => {
    const isUpcoming = new Date(tournament.startDate) > new Date();
    const formattedDate = new Date(tournament.startDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className={`p-4 sm:p-6 flex-grow flex flex-col ${isUpcoming ? 'border-t-4 border-green-500' : 'border-t-4 border-gray-600'}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{tournament.name}</h3>
                    <span className={`flex-shrink-0 ml-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        isUpcoming ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                    }`}>
                        {isUpcoming ? 'Upcoming' : 'Finished'}
                    </span>
                </div>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">{tournament.gameName}</p>
                
                <div className="text-sm text-gray-300 space-y-2 flex-grow">
                    <p><span className="font-semibold">Date:</span> {formattedDate}</p>
                    <p><span className="font-semibold">Prize:</span> {tournament.prizePool}</p>
                    <p><span className="font-semibold">Team Size:</span> {tournament.teamSize}v{tournament.teamSize}</p>
                </div>

                <button 
                    onClick={() => onViewDetails(tournament.id)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

const TournamentsPage = ({ onNavigate, onViewDetails }) => {
    const { user } = useAuth();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await tournamentService.getAllTournaments();
                setTournaments(response.data.content);
            } catch (err) {
                setError('Failed to load tournaments.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournaments();
    }, []);

    if (loading) return <p className="text-center text-xl p-8">Loading tournaments...</p>;
    if (error) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-white">Tournaments</h2>
                {isAdmin && (
                    <button 
                        onClick={() => onNavigate('create-tournament')} 
                        className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-transform hover:scale-105"
                    >
                        Create New Tournament
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {tournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} onViewDetails={onViewDetails} />
                ))}
            </div>
        </div>
    );
};

export default TournamentsPage;
