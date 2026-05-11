import { useEffect, useRef } from 'react';

export const WebRTCPlayer = ({ streamName, className }: { streamName: string, className?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl || !streamName) return;

        let pc: RTCPeerConnection | null = null;

        const startWebRTC = async () => {
            try {
                // Determine hostname to allow access from other devices in the local network
                const hostname = 'localhost';
                const whepUrl = `http://${hostname}:8889/${streamName}/whep`;
                console.log("Requesting WebRTC stream from:", whepUrl);

                pc = new RTCPeerConnection();
                pc.addTransceiver('video', { direction: 'recvonly' });
                pc.addTransceiver('audio', { direction: 'recvonly' });

                pc.ontrack = (event) => {
                    if (videoEl.srcObject !== event.streams[0]) {
                        videoEl.srcObject = event.streams[0];
                    }
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                const res = await fetch(whepUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/sdp' },
                    body: offer.sdp
                });

                if (!res.ok) {
                    console.error("Failed to fetch WebRTC SDP answer:", res.statusText);
                    return;
                }

                const answerSdp = await res.text();
                await pc.setRemoteDescription({
                    type: 'answer',
                    sdp: answerSdp
                });
                
                console.log(`WebRTC connected successfully for ${streamName}!`);
            } catch (err) {
                console.error("WebRTC Error:", err);
            }
        };

        startWebRTC();

        return () => {
            if (pc) {
                pc.close();
                if (videoEl) videoEl.srcObject = null;
            }
        };
    }, [streamName]);

    return (
        <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover ${className || ''}`}
        />
    );
};
