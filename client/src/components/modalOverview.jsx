import 'react';
import PropTypes from 'prop-types';


function ModalOverview({ player, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="py-8 px-8 max-w-sm mx-auto space-y-2 bg-white rounded-xl shadow-lg sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:gap-x-6">
                <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0" src={player.role.roleImg} alt="Role" />
                <div className="text-center space-y-2 sm:text-left">
                    <div className="space-y-0.5">
                        <p className="text-lg text-black font-semibold">
                            {player.name}
                        </p>
                        <p className="text-slate-500 font-medium">
                            {player.role.roleName}
                        </p>
                        <p className="text-slate-500 font-medium">
                            {player.role.description}
                        </p>
                        <p className="text-slate-500 font-medium">
                            {player.role.goal}
                        </p>
                    </div>
                    <button onClick={onClose}
                            className="px-4 py-1 text-sm text-yellow-950 font-semibold rounded-full border border-b-yellow-200 hover:text-white hover:bg-yellow-950 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-yellow-950 focus:ring-offset-2">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

ModalOverview.propTypes = {
    player: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ModalOverview;