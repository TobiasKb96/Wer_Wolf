import { useState } from "react";
import PropTypes from "prop-types";
import gameController from "./gameController.js";
import socket from "../../utils/socket.js";

function Voting({ player }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");

    const handleVoteClick = () => {
        if (showDropdown && selectedPlayer) {
            gameController.castVote(player.name, selectedPlayer);
            alert(`${player.name} has voted for ${selectedPlayer}`);
            setShowDropdown(false);
            socket.emit('vote', { voter: player.name, votedFor: selectedPlayer });
        } else {
            setShowDropdown(true);
        }
    };

    return (
        <div>
            {showDropdown && (
                <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="border border-gray-300 rounded px-4 py-2 mb-4 text-black">
                    <option value="" disabled>Select a player</option>
                    {gameController.getPlayers().filter((foe) => foe.name !== player.name).map((foe) => (
                        <option key={foe.id} value={foe.name}>{foe.name}</option>
                    ))}
                </select>
            )}
            <button onClick={handleVoteClick} className="px-6 py-3 text-lg text-white bg-blue-600 rounded-md transition-colors hover:bg-blue-700">
                {showDropdown ? "Send Vote" : "Vote"}
            </button>
        </div>
    );
}

Voting.propTypes = {
    player: PropTypes.object.isRequired,
};

export default Voting;