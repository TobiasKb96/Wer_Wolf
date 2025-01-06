import { io } from 'socket.io-client';
const backendUrl = window.__BACKEND_URL__;

const socket = io(backendUrl); // Adjust to your server's URL
let peerConnection;

const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // Use Google's STUN server
};

export function createPeerConnection() {
    peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('candidate', {
                candidate: event.candidate,
                target: targetPeerId // Set dynamically
            });
        }
    };

    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onmessage = (e) => {
            console.log('Message from peer:', e.data);
        };
    };

    return peerConnection;
}

export function startSignaling(targetPeerId) {
    const dataChannel = peerConnection.createDataChannel('gameChannel');

    dataChannel.onopen = () => {
        console.log('Data channel open');
    };

    dataChannel.onmessage = (event) => {
        console.log('Message from peer:', event.data);
    };

    peerConnection.createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
            socket.emit('offer', { sdp: peerConnection.localDescription, target: targetPeerId });
        });
}

socket.on('offer', async (data) => {
    const { sdp, sender } = data;

    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit('answer', { sdp: peerConnection.localDescription, target: sender });
});

socket.on('answer', (data) => {
    const { sdp } = data;
    peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
});

socket.on('candidate', (data) => {
    const { candidate } = data;
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
