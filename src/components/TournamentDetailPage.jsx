import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService'; // Assuming you have this service
import { useAuth } from '../context/AuthContext'; // Assuming you have this context

// A component to display the user's existing registration details
const RegistrationDetails = ({ registration }) => (
    <div className="bg-green-900/50 border border-green-700 p-6 rounded-lg">
        <h4 className="text-xl font-bold text-green-300 mb-4">You Are Registered!</h4>
        <p className="text-gray-300 mb-4">Here are the details you submitted:</p>
        
        <div className="space-y-4">
            {/* Team Details */}
            <div>
                <h5 className="font-semibold text-gray-200 mb-2">Team Details</h5>
                <div className="pl-4 border-l-2 border-green-500 space-y-1 text-sm">
                    {registration.teamFields.map(field => (
                        <p key={field.fieldName}><span className="text-gray-400">{field.fieldName}:</span> {field.value}</p>
                    ))}
                </div>
            </div>

            {/* Player Details */}
            {registration.playerSubmissions.map((player, index) => (
                 <div key={player.playerSubmissionId}>
                    <h5 className="font-semibold text-gray-200 mb-2 mt-3">Player {index + 1}</h5>
                    <div className="pl-4 border-l-2 border-green-500 space-y-1 text-sm">
                        {player.fieldValues.map(field => (
                            <p key={field.fieldName}><span className="text-gray-400">{field.fieldName.replace(`Player ${index + 1} `, '')}:</span> {field.value}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const TournamentDetailPage = ({ tournamentId, onNavigate }) => {
    const { user } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                const response = await tournamentService.getTournamentById(tournamentId);
                setTournament(response.data);
            } catch (err) {
                setError('Failed to load tournament details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTournament();
    }, [tournamentId, success]); // Re-fetch on success to show new registration

    const handleInputChange = (fieldId, value) => {
        setFormValues(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const registrationData = {
            teamFields: [],
            playerSubmissions: []
        };
        const playersMap = {};

        tournament.requiredFields.forEach(field => {
            const value = formValues[field.id];
            if (!value && field.isRequired) {
                setError(`Field "${field.fieldName}" is required.`);
                return;
            }
            if (!value) return;

            const fieldValue = {
                fieldDefinitionId: field.id,
                value: value
            };

            const playerMatch = field.fieldName.match(/Player (\d+)/i);
            
            if (playerMatch) {
                const playerIndex = parseInt(playerMatch[1]) - 1;
                if (!playersMap[playerIndex]) {
                    playersMap[playerIndex] = { fieldValues: [] };
                }
                playersMap[playerIndex].fieldValues.push(fieldValue);
            } else {
                registrationData.teamFields.push(fieldValue);
            }
        });
        
        if(error) {
            setLoading(false);
            return;
        }

        registrationData.playerSubmissions = Object.values(playersMap);

        try {
            await tournamentService.registerTeam(tournamentId, registrationData);
            setSuccess('Your team has been registered successfully!');
        } catch (err) {
            const errorMsg = err.response?.data?.messages?.join(', ') || 'Registration failed. Please check your details.';
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getGroupedFields = () => {
        if (!tournament) return { teamFields: [], playerFields: [] };
        
        const teamFields = tournament.requiredFields.filter(f => !f.fieldName.match(/Player (\d+)/i));
        const playerFields = [];
        
        for (let i = 1; i <= tournament.teamSize; i++) {
            const fieldsForPlayer = tournament.requiredFields.filter(f => {
                const match = f.fieldName.match(/Player (\d+)/i);
                return match && parseInt(match[1]) === i;
            });
            if (fieldsForPlayer.length > 0) {
                playerFields.push({ playerNumber: i, fields: fieldsForPlayer });
            }
        }
        return { teamFields, playerFields };
    };

    if (loading && !tournament) return <p className="text-center text-xl p-8">Loading Tournament...</p>;
    if (error && !tournament) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;

    const isTournamentFinished = tournament && new Date(tournament.startDate) < new Date();
    const { teamFields, playerFields } = getGroupedFields();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-white mb-2">{tournament.name}</h2>
                <p className="text-gray-400 mb-6">{tournament.rules}</p>
                
                <h3 className="text-2xl font-bold text-white mb-4 border-t border-gray-700 pt-6">Registration</h3>
                
                {success && <p className="text-sm text-green-400 text-center mb-4">{success}</p>}

                {!user ? (
                    <div className="text-center text-gray-400 border border-dashed border-gray-600 p-8 rounded-lg">
                        <p>You must be logged in to register for this tournament.</p>
                        <button onClick={() => onNavigate('login')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                ) : isTournamentFinished ? (
                    <div className="text-center text-yellow-400 bg-yellow-900/50 border border-yellow-700 p-8 rounded-lg">
                        <p className="font-bold text-lg">Registrations for this tournament have closed.</p>
                    </div>
                ) : tournament.userRegistration ? (
                    <RegistrationDetails registration={tournament.userRegistration} />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-200 mb-3">Team Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teamFields.map(field => (
                                    <div key={field.id}>
                                        <label htmlFor={`field-${field.id}`} className="block text-sm font-medium text-gray-300">
                                            {field.fieldName} {field.isRequired && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            id={`field-${field.id}`}
                                            type={field.fieldType === 'NUMBER' ? 'number' : 'text'}
                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            required={field.isRequired}
                                            className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {playerFields.map(playerGroup => (
                            <div key={playerGroup.playerNumber}>
                                <h4 className="text-lg font-semibold text-gray-200 mb-3 border-t border-gray-700 pt-4">Player {playerGroup.playerNumber}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {playerGroup.fields.map(field => (
                                         <div key={field.id}>
                                            <label htmlFor={`field-${field.id}`} className="block text-sm font-medium text-gray-300">
                                                {field.fieldName.replace(`Player ${playerGroup.playerNumber} `, '')} {field.isRequired && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                id={`field-${field.id}`}
                                                type={field.fieldType === 'NUMBER' ? 'number' : 'text'}
                                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                required={field.isRequired}
                                                className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        
                        <button type="submit" disabled={loading} className="w-full py-3 mt-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
                            {loading ? 'Submitting...' : 'Register Team'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TournamentDetailPage;
