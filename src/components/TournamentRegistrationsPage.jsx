import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

const TeamRegistrationCard = ({ registration }) => {
    const teamNameField = registration.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
    const otherTeamFields = registration.teamFields.filter(f => f !== teamNameField);

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-red-500/30">
            <div className="p-4 bg-gray-700/50 border-b-2 border-gray-700">
                <h3 className="text-lg font-bold text-white truncate">{teamNameField ? teamNameField.value : 'Unnamed Team'}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-2">
                    {otherTeamFields.map(field => (
                        <p key={field.fieldName} className="text-gray-400">
                            <span className="font-semibold">{field.fieldName}:</span> {field.value}
                        </p>
                    ))}
                </div>
                 <p className="text-xs text-gray-500 mt-2 text-right">Submitted by: {registration.submittedByEmail}</p>
            </div>
            
            <div className="p-4">
                <h4 className="font-semibold text-gray-300 mb-3">Player Roster</h4>
                <div className="space-y-3">
                    {registration.playerSubmissions.map((player, index) => (
                        <div key={player.playerSubmissionId} className="bg-gray-900/50 p-3 rounded-md border-l-4 border-gray-600">
                            <p className="font-bold text-sm text-red-400 mb-2">Player {index + 1}</p>
                            <div className="space-y-1">
                                {player.fieldValues.map(field => (
                                    <div key={field.fieldName} className="flex justify-between text-xs">
                                        <span className="font-semibold text-gray-400">{field.fieldName.replace(/Player \d+ /, '')}:</span>
                                        <span className="text-white font-mono">{field.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const TournamentRegistrationsPage = ({ tournamentId, onNavigate }) => {
    const { user } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    const fetchPageData = async () => {
        setLoading(true);
        try {
            const tournamentDetailsRes = await tournamentService.getTournamentById(tournamentId);
            const registrationsRes = await tournamentService.getRegistrationsForTournament(tournamentId);
            
            setTournament(tournamentDetailsRes.data);
            setRegistrations(registrationsRes.data);
        } catch (err) {
            setError('Failed to load tournament data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, [tournamentId]);

    const handleStartTournament = async () => {
        if (!window.confirm(`Are you sure you want to start "${tournament.name}"? This cannot be undone.`)) {
            return;
        }
        setLoading(true);
        try {
            await tournamentService.startTournament(tournamentId);
            onNavigate('tournament-bracket');
        } catch (err) {
            setError(err.response?.data || 'Failed to start tournament.');
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-xl p-8">Loading Registrations...</p>;
    if (error) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;
    if (!tournament) return null;

    const isRegistrationOpen = tournament.status === 'REGISTRATION_OPEN';

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-2 text-white">{tournament.name} Registrations</h2>
            <p className="text-center text-gray-400 mb-8">Status: <span className="font-semibold text-yellow-400">{tournament.status.replace('_', ' ')}</span></p>

            {/* ADMIN ACTION SECTION */}
            {isAdmin && isRegistrationOpen && (
                <div className="mb-8 p-4 bg-red-900/20 border border-red-700 rounded-lg text-center">
                    <h4 className="font-bold text-lg text-white">Admin Action</h4>
                    
                    {registrations.length < 2 ? (
                        <p className="text-yellow-300 text-sm my-2">
                            A minimum of 2 teams are required to start the tournament. 
                            Currently, there {registrations.length === 1 ? 'is' : 'are'} only {registrations.length} registered.
                        </p>
                    ) : (
                        <>
                            <p className="text-red-300 text-sm my-2">This tournament is ready to begin. Starting the tournament will close registrations and generate the first round of matches.</p>
                            <button 
                                onClick={handleStartTournament}
                                disabled={loading}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-500"
                            >
                                {loading ? 'Starting...' : 'Start Tournament'}
                            </button>
                        </>
                    )}
                </div>
            )}

            {registrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.map(reg => (
                        <TeamRegistrationCard key={reg.registrationId} registration={reg} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-gray-800 p-8 rounded-lg">
                    <p className="text-gray-400">No teams have registered for this tournament yet.</p>
                </div>
            )}
        </div>
    );
};

export default TournamentRegistrationsPage;
