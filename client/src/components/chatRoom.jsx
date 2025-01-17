import { useState, useEffect } from 'react';
import socket from '../utils/socket';

const ChatRoom = ({messages, setMessages, currentUser, recipient, onClose}) => {

    const [newMessage, setNewMessage] = useState('');


    //TODO: Messages als ganzes Array hier übernehmen und dann nach recipient und currentUser filtern
    //TODO: setMessages woanders als socket abhören



    if (!currentUser || !recipient) {
        console.error("ChatRoom: Missing currentUser or recipient");
        return null;
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const messageData = {
            sender: currentUser,
            senderName: currentUser.name,
            recipient: recipient,
            text: newMessage,
        };

        socket.emit('sendMessage', messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage('');  // Clear input
    };

    return (
        <div className="fixed bottom-0 right-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                <h2>Chat with {recipient.name}</h2>
                <button onClick={onClose} className="text-red-500">X</button>
            </div>

            <div className="p-4 h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 p-2 rounded ${
                            msg.sender.id === currentUser.id ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'
                        }`}
                    >
                        <p><b>{msg.senderName}:</b> {msg.text}</p>
                    </div>
                ))}
            </div>

            <div className="flex p-2 border-t">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow p-2 border rounded-l-md"
                />
                <button
                    onClick={handleSendMessage}
                    className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;