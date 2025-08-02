import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';

const TeamRegistrationCard = ({ registration }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
                {registration.teamFields.map(field => (
                    <p key={field.fieldName} className="text-sm text-gray-300">
                        <span className="font-bold text-gray-400">{field.fieldName}: </span>
                        {field.value}
                    </p>
                ))}
                <p className="text-xs text-gray-500 mt-2">Submitted by: {registration.submittedByEmail}</p>
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-gray-300 mb-2">Players:</h4>
                <div className="space-y-3">
                    {registration.playerSubmissions.map(player => (
                        <div key={player.playerSubmissionId} className="bg-gray-900/50 p-3 rounded-md">
                            {player.fieldValues.map(field => (
                                <p key={field.fieldName} className="text-sm">
                                    <span className="font-semibold text-gray-400">{field.fieldName}: </span>
                                    <span className="text-white">{field.value}</span>
                                </p>
                            ))}
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
                <p className="text-center text-gray-400">No teams have registered for this tournament yet.</p>
            )}
        </div>
    );
};

export default TournamentRegistrationsPage;
