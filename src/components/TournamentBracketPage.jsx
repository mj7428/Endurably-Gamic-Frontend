import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // ✅ IMPORT useParams
import Confetti from 'react-confetti';
import tournamentService from '../services/tournamentService';
import { useAuth } from '../context/AuthContext';

// (The TournamentWinnerBanner and MatchCard components remain the same)

const TournamentWinnerBanner = ({ winnerTeam, prizePool }) => {
    if (!winnerTeam) return null;
    const getTeamName = (team) => {
        const nameField = team.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
        return nameField ? nameField.value : 'Unnamed Team';
    };
    return (
        <div className="mb-8 p-6 bg-gray-800 border border-red-500 rounded-xl shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-red-500/30 via-transparent to-red-500/30 animate-spin-slow"></div>
            <div className="relative z-10">
                <div className="flex justify-center items-center mb-3">
                    <span className="text-5xl mr-4">🏆</span>
                    <div>
                        <h3 className="text-xl font-semibold text-red-300 tracking-wider">TOURNAMENT CHAMPION</h3>
                        <p className="text-4xl font-extrabold text-white tracking-wider mt-1">{getTeamName(winnerTeam)}</p>
                    </div>
                </div>
                {prizePool && (
                    <div className="mt-4 pt-3 border-t border-red-600/50">
                        <p className="font-semibold text-red-200">Prize: <span className="font-normal text-white">{prizePool}</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MatchCard = ({ match, onDeclareWinner }) => {
    const { user } = useAuth();
    const isAdmin = user && user.roles.includes('ROLE_ADMIN');

    const getTeamName = (team) => {
        if (!team) return 'BYE';
        const nameField = team.teamFields.find(f => f.fieldName.toLowerCase().includes('name'));
        return nameField ? nameField.value : 'Unnamed Team';
    };

    const handleWinnerClick = (team) => {
        if (window.confirm(`Are you sure you want to declare "${getTeamName(team)}" as the winner?`)) {
            onDeclareWinner(match, team.registrationId);
        }
    };

    const renderTeam = (team, isWinner) => (
        <div className={`flex items-center justify-between p-2 rounded ${isWinner ? 'bg-green-500/20 font-bold text-white' : 'bg-gray-700'}`}>
            <span className="truncate">{getTeamName(team)}</span>
            {isAdmin && !match.winner && team && match.status !== 'COMPLETED' && (
                 <button 
                    onClick={() => handleWinnerClick(team)}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded ml-2 flex-shrink-0"
                 >
                     Set Winner
                 </button>
            )}
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-lg p-3 w-64 flex-shrink-0 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Round {match.roundNumber} - Match {match.matchNumber}</p>
            <div className="space-y-2">
                {renderTeam(match.teamA, match.winner && match.winner.registrationId === match.teamA?.registrationId)}
                <div className="text-center text-gray-500 text-sm font-bold">VS</div>
                {renderTeam(match.teamB, match.winner && match.winner.registrationId === match.teamB?.registrationId)}
            </div>
        </div>
    );
};


const TournamentBracketPage = () => {
    // ✅ GET the tournamentId from the URL using the useParams hook
    const { tournamentId } = useParams(); 

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
    }, [tournamentId, tournament]);

    useEffect(() => {
        fetchTournamentData();
    }, [fetchTournamentData]);
    
    const handleDeclareWinner = async (match, winnerTeamId) => {
        try {
            await tournamentService.declareWinner(tournamentId, match.roundNumber, match.matchNumber, { winnerTeamId });
            fetchTournamentData(); 
        } catch (err) {
            console.error("Failed to declare winner", err);
            setError(err.response?.data?.messages?.join(', ') || 'An error occurred while declaring the winner.');
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
        <div className="container mx-auto px-4 py-8 relative">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={400}
                    onConfettiComplete={() => setShowConfetti(false)}
                />
            )}

            <h2 className="text-3xl font-bold text-white text-center mb-2">{tournament.name}</h2>
            <p className="text-center text-gray-400 mb-8">Status: <span className="font-semibold text-red-400">{tournament.status.replace('_', ' ')}</span></p>

            {tournamentWinner && <TournamentWinnerBanner winnerTeam={tournamentWinner} prizePool={tournament.prizePool}/>}

            <div className="flex space-x-4 overflow-x-auto p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {groupedMatches && Object.entries(groupedMatches).map(([roundNumber, matches]) => (
                    <div key={roundNumber} className="flex flex-col items-center flex-shrink-0">
                        <h3 className="text-xl font-bold text-white mb-4">Round {roundNumber}</h3>
                        <div className="space-y-4">
                            {matches.sort((a, b) => a.matchNumber - b.matchNumber).map(match => (
                                <MatchCard 
                                    key={`${match.roundNumber}-${match.matchNumber}`} 
                                    match={match} 
                                    onDeclareWinner={handleDeclareWinner}
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
