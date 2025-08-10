import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// CreateTournamentPage Component (Fully Responsive & Improved UI)
// ============================================================================
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
        const { name, value, type, checked } = event.target;
        fields[index][name] = type === 'checkbox' ? checked : value;
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

    // Reusable input style
    const inputStyle = "mt-1 w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

    const InputField = ({ id, label, type = "text", value, onChange, required, min, icon }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
            <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input type={type} id={id} value={value} onChange={onChange} required={required} min={min} className={inputStyle} />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New Tournament</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Main Details Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField id="name" label="Tournament Name" value={name} onChange={(e) => setName(e.target.value)} required icon={<span className="text-gray-400">🏆</span>} />
                        <InputField id="gameName" label="Game" value={gameName} onChange={(e) => setGameName(e.target.value)} required icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>} />
                        <InputField id="startDate" label="Start Date & Time" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>} />
                        <InputField id="teamSize" label="Team Size" type="number" value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} required min="1" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 100-6 3 3 0 000 6zm.329 4.495a1 1 0 10-1.658-.79V18a1 1 0 102 0v-2.795a1 1 0 00-.342-.705zM15.5 5.5a3 3 0 100-6 3 3 0 000 6zm-1.5 5.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                        <div className="sm:col-span-2">
                            <InputField id="prizePool" label="Prize Pool" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} icon={<span className="text-gray-400">💰</span>} />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="rules" className="block text-sm font-medium text-gray-300">Rules</label>
                            <textarea id="rules" value={rules} onChange={(e) => setRules(e.target.value)} rows="4" className="mt-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"></textarea>
                        </div>
                    </div>

                    {/* Registration Fields Section */}
                    <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Registration Form Fields</h3>
                        <div className="space-y-4">
                            {requiredFields.map((field, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                                    <input type="text" name="fieldName" placeholder="Field Name (e.g., Player 1 Tag)" value={field.fieldName} onChange={e => handleFieldChange(index, e)} required className="w-full sm:flex-grow px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <select name="fieldType" value={field.fieldType} onChange={e => handleFieldChange(index, e)} className="w-full sm:w-auto px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="TEXT">Text</option>
                                        <option value="NUMBER">Number</option>
                                    </select>
                                    <button type="button" onClick={() => handleRemoveField(index)} className="w-full sm:w-auto bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 text-sm font-semibold">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={handleAddField} className="w-full mt-4 py-2 px-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition">
                            + Add Field
                        </button>
                    </div>
                    
                    {error && <p className="text-sm text-red-400 text-center py-2">{error}</p>}
                    {success && <p className="text-sm text-green-400 text-center py-2">{success}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 transition-all">
                        {loading ? 'Creating Tournament...' : 'Create Tournament'}
                    </button>
                </form>
            </div>
        </div>
    );
};



export default CreateTournamentPage; 
