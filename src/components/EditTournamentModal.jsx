import React, { useState, useEffect } from 'react';
import tournamentService from '../services/tournamentService';

const EditTournamentModal = ({ isOpen, onClose, tournament, onUpdate }) => {
    const [name, setName] = useState('');
    const [gameName, setGameName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [prizePool, setPrizePool] = useState('');
    const [teamSize, setTeamSize] = useState(1);
    const [rules, setRules] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (tournament) {
            setName(tournament.name || '');
            setGameName(tournament.gameName || '');
            setStartDate(tournament.startDate ? tournament.startDate.slice(0, 16) : '');
            setPrizePool(tournament.prizePool || '');
            setTeamSize(tournament.teamSize || 1);
            setRules(tournament.rules || '');
        }
    }, [tournament]);

    if (!isOpen || !tournament) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const updateData = { name, gameName, startDate, prizePool, teamSize, rules };
            console.log('inside tournament service');
            await tournamentService.patchTournament(tournament.id, updateData);
            onUpdate(); 
            onClose();
        } catch (err) {
            setError('Failed to update tournament. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-lg max-w-lg w-full">
                <h2 className="text-xl font-bold text-white mb-4">Edit Tournament</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Tournament Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="Game Name" value={gameName} onChange={e => setGameName(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-2 bg-gray-700 rounded" />
                    <input type="text" placeholder="Prize Pool" value={prizePool} onChange={e => setPrizePool(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                    <input type="number" placeholder="Team Size" value={teamSize} onChange={e => setTeamSize(parseInt(e.target.value))} min="1" required className="w-full p-2 bg-gray-700 rounded" />
                    <textarea placeholder="Rules" value={rules} onChange={e => setRules(e.target.value)} rows="3" className="w-full p-2 bg-gray-700 rounded"></textarea>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-red-600 px-4 py-2 rounded">{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTournamentModal;

