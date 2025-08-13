import React, { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

// ============================================================================
// NEW: Component to display the tournament winner
// ============================================================================
const TournamentWinnerBanner = ({ winnerTeam, prizePool }) => {
    if (!winnerTeam) return null;

    const getTeamName = (team) => {
        const nameField = team.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
        return nameField ? nameField.value : 'Unnamed Team';
    };

    return (
        <div className="mb-8 p-6 bg-gray-800 border border-yellow-500 rounded-xl shadow-2xl text-center relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-yellow-500/30 via-transparent to-yellow-500/30 animate-spin-slow"></div>
            
            <div className="relative z-10">
                <div className="flex justify-center items-center mb-3">
                    <span className="text-5xl mr-4">🏆</span>
                    <div>
                        <h3 className="text-xl font-semibold text-yellow-300 tracking-wider">TOURNAMENT CHAMPION</h3>
                        <p className="text-4xl font-extrabold text-white tracking-wider mt-1">{getTeamName(winnerTeam)}</p>
                    </div>
                </div>
                {prizePool && (
                    <div className="mt-4 pt-3 border-t border-yellow-600/50">
                        <p className="font-semibold text-yellow-200">Prize: <span className="font-normal text-white">{prizePool}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};



// ============================================================================
// MatchCard Component (No changes needed)
// ============================================================================
const MatchCard = ({ match, onDeclareWinner, tournamentId }) => {
    const { user } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    const getTeamName = (team) => {
        if (!team) return 'BYE';
        const nameField = team.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
        return nameField ? nameField.value : 'Unnamed Team';
    };

    const renderTeam = (team, isWinner) => (
        <div className={`flex items-center justify-between p-2 rounded ${isWinner ? 'bg-green-500/20 font-bold text-white' : 'bg-gray-700'}`}>
            <span className="truncate">{getTeamName(team)}</span>
            {isAdmin && !match.winner && team && match.status !== 'COMPLETED' && (
                 <button 
                    onClick={() => onDeclareWinner(match.id, team.registrationId)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded ml-2 flex-shrink-0"
                 >
                     Set Winner
                 </button>
            )}
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-lg p-3 w-64 flex-shrink-0 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Match {match.matchNumber}</p>
            <div className="space-y-2">
                {renderTeam(match.teamA, match.winner && match.winner.registrationId === match.teamA?.registrationId)}
                <div className="text-center text-gray-500 text-sm font-bold">VS</div>
                {renderTeam(match.teamB, match.winner && match.winner.registrationId === match.teamB?.registrationId)}
            </div>
        </div>
    );
};


// ============================================================================
// Main TournamentBracketPage Component (Updated)
// ============================================================================
const TournamentBracketPage = ({ tournamentId }) => {
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const fetchTournamentData = useCallback(async () => {
        if (!tournamentId) {
            setError("Tournament ID is missing.");
            setLoading(false);
            return;
        }
        try {
            if (!tournament) setLoading(true);
            const response = await tournamentService.getTournamentById(tournamentId);
            setTournament(response.data);
        } catch (err) {
            setError('Failed to load tournament details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        fetchTournamentData();
    }, [fetchTournamentData]);

    const handleDeclareWinner = async (matchId, winnerTeamId) => {
        try {
            await tournamentService.declareWinner(tournamentId, matchId, { winnerTeamId });
            fetchTournamentData(); 
        } catch (err) {
            console.error("Failed to declare winner", err);
            setError(err.response?.data || 'An error occurred while declaring the winner.');
        }
    };
    
    const groupedMatches = tournament?.matches?.reduce((acc, match) => {
        (acc[match.roundNumber] = acc[match.roundNumber] || []).push(match);
        return acc;
    }, {});

    let tournamentWinner = null;
    if (tournament?.status === 'COMPLETED' && groupedMatches) {
        const finalRoundNumber = Math.max(...Object.keys(groupedMatches));
        const finalMatch = groupedMatches[finalRoundNumber]?.[0];
        if (finalMatch) {
            tournamentWinner = finalMatch.winner;
        }
    }

    useEffect(() => {
        if (tournamentWinner) {
            setShowConfetti(true);
        }
    }, [tournamentWinner]);

    if (loading) return <p className="text-center text-xl p-8">Loading Bracket...</p>;
    if (error) return <p className="text-center text-xl text-red-500 p-8">{error}</p>;
    if (!tournament) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={1000}
                    onConfettiComplete={() => setShowConfetti(false)}
                />
            )}
            <h2 className="text-3xl font-bold text-white text-center mb-2">{tournament.name}</h2>
            <p className="text-center text-gray-400 mb-8">Status: <span className="font-semibold text-yellow-400">{tournament.status.replace('_', ' ')}</span></p>

            {tournamentWinner && <TournamentWinnerBanner winnerTeam={tournamentWinner} prizePool={tournament.prizePool}/>}

            <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {groupedMatches && Object.entries(groupedMatches).map(([roundNumber, matches]) => (
                    <div key={roundNumber} className="flex flex-col items-center flex-shrink-0">
                        <h3 className="text-xl font-bold text-white mb-4">Round {roundNumber}</h3>
                        <div className="space-y-4">
                            {matches.map(match => (
                                <MatchCard 
                                    key={match.id} 
                                    match={match} 
                                    onDeclareWinner={handleDeclareWinner}
                                    tournamentId={tournamentId}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentBracketPage;
