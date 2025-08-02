import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

const TournamentDetailPage = ({ tournamentId, onNavigate }) => {
    const { user } = useAuth();
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // This state will hold the user's answers for the dynamic form
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
    }, [tournamentId]);

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

        registrationData.playerSubmissions = Object.values(playersMap);

        console.log("---------registration data-------",registrationData);

        try {
            await tournamentService.registerTeam(tournamentId, registrationData);
            setSuccess('Your team has been registered successfully!');
        } catch (err) {
            setError('Registration failed. Please check your details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-xl p-8">Loading Tournament...</p>;
    if (error && !tournament) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-white mb-2">{tournament.name}</h2>
                <p className="text-gray-400 mb-6">{tournament.rules}</p>
                
                <h3 className="text-2xl font-bold text-white mb-4 border-t border-gray-700 pt-6">Registration Form</h3>
                
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tournament.requiredFields.map(field => (
                            <div key={field.id}>
                                <label htmlFor={`field-${field.id}`} className="block text-sm font-medium text-gray-300">
                                    {field.fieldName} {field.isRequired && '*'}
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

                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-400 text-center">{success}</p>}

                        <button type="submit" disabled={loading} className="w-full py-3 mt-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500">
                            {loading ? 'Submitting...' : 'Register Team'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center text-gray-400 border border-dashed border-gray-600 p-8 rounded-lg">
                        <p>You must be logged in to register for this tournament.</p>
                        <button onClick={() => onNavigate('login')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentDetailPage;
