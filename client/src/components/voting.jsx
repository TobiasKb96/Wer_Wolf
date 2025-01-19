import { useState } from "react";
import PropTypes from "prop-types";
import gameController from "../pages/Game/gamelogic/gameController.js";
import socket from "../utils/socket.js";

function Voting({ player , votingChoices, setVoting}) {
    const [selectedPlayer, setSelectedPlayer] = useState("");

    //TODO: Voting timer

    const handleVoteClick = () => {
            gameController.castVote(player.name, selectedPlayer);
            alert(`${player.name} has voted for ${selectedPlayer}`);
            socket.emit('vote', { voter: player.name, votedFor: selectedPlayer});
            setVoting(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="py-8 px-8 max-w-sm mx-auto space-y-2 bg-white rounded-xl shadow-lg sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:gap-x-6">
                <div className="text-center space-y-2 sm:text-left">
                    <div className="space-y-0.5">
                        <p className="text-lg text-black font-semibold">
                            Vote now:
                        </p>
                        <p className="text-slate-500 font-medium">
                                <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}
                                        className="border border-gray-300 rounded px-4 py-2 mb-4 text-black">
                                    <option value="" disabled>Select a player</option>
                                    {votingChoices.filter((foe) => foe.name !== player.name).map((foe) => (
                                        <option key={foe.id} value={foe.name}>{foe.name}</option>
                                    ))}
                                </select>
                        </p>
                    </div>
                    <button onClick={handleVoteClick}
                            className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
                        Send Vote
                    </button>
                </div>
            </div>
        </div>
    );
}

Voting.propTypes = {
    player: PropTypes.object.isRequired,
    votingChoices: PropTypes.array
};

export default Voting;

