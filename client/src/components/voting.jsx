import { useState } from "react";
import PropTypes from "prop-types";
import gameController from "../pages/Game/gamelogic/gameController.js";
import socket from "../utils/socket.js";

function Voting({ player , votingChoices, setVoting}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState("");


    const handleVoteClick = () => {
        if (showDropdown && selectedPlayer) {
            gameController.castVote(player.name, selectedPlayer);
            alert(`${player.name} has voted for ${selectedPlayer}`);
            setShowDropdown(false);
            socket.emit('vote', { voter: player.name, votedFor: selectedPlayer});
            setVoting(false);
        } else {
            setShowDropdown(true);
        }

    };

    return (

        <div>
            <div>
                <h2>Vote now:</h2><br/>
                {showDropdown && (
                    <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="border border-gray-300 rounded px-4 py-2 mb-4 text-black">
                        <option value="" disabled>Select a player</option>
                        {votingChoices.filter((foe) => foe.name !== player.name).map((foe) => (
                            <option key={foe.id} value={foe.name}>{foe.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <button onClick={handleVoteClick} className="px-6 py-3 text-lg text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
                {showDropdown ? "Send Vote" : "Vote"}
            </button>
        </div>
    );
}

Voting.propTypes = {
    player: PropTypes.object.isRequired,
    votingChoices: PropTypes.array
};

export default Voting;




/*export function DialogDefault() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Open Modal
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Its a simple modal.</DialogHeader>
        <DialogBody>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}*/