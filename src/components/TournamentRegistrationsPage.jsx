import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';

const TeamRegistrationCard = ({ registration }) => {
    // Find the primary team name, assuming it's the first field like "Clan Name"
    const teamNameField = registration.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
    const otherTeamFields = registration.teamFields.filter(f => f !== teamNameField);

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-blue-500/30">
            {/* Card Header for Team Info */}
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
            
            {/* Card Body for Player List */}
            <div className="p-4">
                <h4 className="font-semibold text-gray-300 mb-3">Player Roster</h4>
                <div className="space-y-3">
                    {registration.playerSubmissions.map((player, index) => (
                        <div key={player.playerSubmissionId} className="bg-gray-900/50 p-3 rounded-md border-l-4 border-gray-600">
                            <p className="font-bold text-sm text-blue-400 mb-2">Player {index + 1}</p>
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


const TournamentRegistrationsPage = ({ tournamentId }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await tournamentService.getRegistrationsForTournament(tournamentId);
                setRegistrations(response.data);
            } catch (err) {
                setError('Failed to load registrations. You may not have permission to view this.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, [tournamentId]);

    if (loading) return <p className="text-center text-xl p-8">Loading Registrations...</p>;
    if (error) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Tournament Registrations</h2>
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
