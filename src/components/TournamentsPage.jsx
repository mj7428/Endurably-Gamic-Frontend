import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';
import RelevantVideos from './RelevantVideos';
import EditTournamentModal from './EditTournamentModal';

// This sub-component is updated with the new red theme
const TournamentCard = ({ tournament, onViewDetails, onEdit }) => {
    const { user } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    const formattedDate = new Date(tournament.startDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case 'IN_PROGRESS':
                return { text: 'In Progress', color: 'bg-yellow-500/20 text-yellow-400', border: 'border-yellow-500' };
            case 'COMPLETED':
                return { text: 'Completed', color: 'bg-gray-500/20 text-gray-400', border: 'border-gray-600' };
            case 'REGISTRATION_OPEN':
            default:
                return { text: 'Registration Open', color: 'bg-green-500/20 text-green-400', border: 'border-green-500' };
        }
    };
    const statusInfo = getStatusInfo(tournament.status);

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
            <div className={`p-4 sm:p-6 flex-grow flex flex-col border-t-4 ${statusInfo.border}`}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{tournament.name}</h3>
                    <span className={`flex-shrink-0 ml-2 px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                </div>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">{tournament.gameName}</p>
                
                <div className="text-sm text-gray-300 space-y-2 flex-grow">
                    <p><span className="font-semibold">Date:</span> {formattedDate}</p>
                    <p><span className="font-semibold">Prize:</span> {tournament.prizePool}</p>
                    <p><span className="font-semibold">Team Size:</span> {tournament.teamSize}v{tournament.teamSize}</p>
                </div>

                <div className='flex items-center space-x-3 mt-6'>
                    <button 
                        onClick={() => onViewDetails(tournament)}
                        className="flex-1 px-4 py-2 bg-red-600 text-sm text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200">
                        View Details
                    </button>
                    
                    {/* Conditionally render the Edit button if user is an admin and registration is open */}
                    {isAdmin && tournament.status === 'REGISTRATION_OPEN' && (
                        <button 
                            onClick={() => onEdit(tournament)} 
                            className="px-4 py-2 bg-gray-600 text-sm text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75 transition-colors duration-200">
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TournamentsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); 
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');
    const [editingTournament, setEditingTournament] = useState(null);

    const fetchTournaments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await tournamentService.getAllTournaments();
            setTournaments(response.data.content);
        } catch (err) {
            setError('Failed to load tournaments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTournaments();
    }, [fetchTournaments]);
    
    const handleViewDetails = (tournament) => {
        if (isAdmin) {
            if (tournament.status === 'REGISTRATION_OPEN') {
                navigate(`/tournaments/${tournament.id}/registrations`);
            } else {
                navigate(`/tournaments/${tournament.id}/bracket`);
            }
        } else {
            if (tournament.status === 'REGISTRATION_OPEN') {
                navigate(`/tournaments/${tournament.id}`);
            } else {
                navigate(`/tournaments/${tournament.id}/bracket`);
            }
        }
    };

    if (loading) return <p className="text-center text-xl p-8">Loading tournaments...</p>;
    if (error) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;

    return (
        <>
            <EditTournamentModal 
                isOpen={!!editingTournament}
                onClose={() => setEditingTournament(null)}
                tournament={editingTournament}
                onUpdate={fetchTournaments}
            />
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-white">Tournaments</h2>
                    {isAdmin && (
                        <button 
                            onClick={() => navigate('/tournaments/create')} // ✅ Updated to use navigate
                            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-transform hover:scale-105"
                        >
                            Create New Tournament
                        </button>
                        
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {tournaments.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} onViewDetails={handleViewDetails} onEdit={setEditingTournament}/>
                    ))}
                </div>
                <RelevantVideos 
                    searchTerm={"tournament"} 
                    title="Tournament Highlights" 
                />
            </div>
        </>
    );
};

export default TournamentsPage;
