import React, { useState } from 'react';
import tournamentService from '../services/tournamentService';

const CreateTournamentPage = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [gameName, setGameName] = useState('Clash of Clans');
    const [startDate, setStartDate] = useState('');
    const [prizePool, setPrizePool] = useState('');
    const [teamSize, setTeamSize] = useState(5);
    const [rules, setRules] = useState('');

    const [requiredFields, setRequiredFields] = useState([
        { fieldName: 'Clan Name', fieldType: 'TEXT', isRequired: true },
        { fieldName: 'Clan Tag', fieldType: 'TEXT', isRequired: true },
    ]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddField = () => {
        setRequiredFields([...requiredFields, { fieldName: '', fieldType: 'TEXT', isRequired: true }]);
    };

    const handleRemoveField = (index) => {
        const fields = [...requiredFields];
        fields.splice(index, 1);
        setRequiredFields(fields);
    };

    const handleFieldChange = (index, event) => {
        const fields = [...requiredFields];
        fields[index][event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setRequiredFields(fields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const tournamentData = {
            name, gameName, startDate, prizePool, teamSize, rules, requiredFields
        };

        try {
            await tournamentService.createTournament(tournamentData);
            setSuccess('Tournament created successfully!');
            setTimeout(() => onNavigate('tournaments'), 2000);
        } catch (err) {
            setError('Failed to create tournament. Please check the details and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New Tournament</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Tournament Name</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="gameName" className="block text-sm font-medium text-gray-300">Game</label>
                            <input type="text" id="gameName" value={gameName} onChange={(e) => setGameName(e.target.value)} required className="mt-1 w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Start Date & Time</label>
                            <input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="mt-1 w-full input-style" />
                        </div>
                        <div>
                            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300">Team Size</label>
                            <input type="number" id="teamSize" value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} required min="1" className="mt-1 w-full input-style" />
                        </div>
                        <div className="md:col-span-2">
                             <label htmlFor="prizePool" className="block text-sm font-medium text-gray-300">Prize Pool</label>
                            <input type="text" id="prizePool" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} className="mt-1 w-full input-style" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="rules" className="block text-sm font-medium text-gray-300">Rules</label>
                            <textarea id="rules" value={rules} onChange={(e) => setRules(e.target.value)} rows="4" className="mt-1 w-full input-style"></textarea>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Registration Form Fields</h3>
                        {requiredFields.map((field, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4 p-4 bg-gray-700/50 rounded-lg">
                                <input type="text" name="fieldName" placeholder="Field Name (e.g., Player 1 Tag)" value={field.fieldName} onChange={e => handleFieldChange(index, e)} required className="md:col-span-2 input-style" />
                                <select name="fieldType" value={field.fieldType} onChange={e => handleFieldChange(index, e)} className="input-style">
                                    <option value="TEXT">Text</option>
                                    <option value="NUMBER">Number</option>
                                </select>
                                <button type="button" onClick={() => handleRemoveField(index)} className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddField} className="w-full mt-2 py-2 px-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition">
                            + Add Field
                        </button>
                    </div>
                    
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-400 text-center">{success}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-all">
                        {loading ? 'Creating Tournament...' : 'Create Tournament'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTournamentPage;
