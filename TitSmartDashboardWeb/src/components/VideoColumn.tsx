import type { Device } from '@/types';
import { WebRTCPlayer } from './WebRTCPlayer';

export const VideoColumn = ({ devices, selectedId }: { devices: Device[], selectedId: string }) => {
    const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];

    const renderStream = (device: Device) => {
        if (device.ipAddress === '192.168.10.152') {
            return <WebRTCPlayer streamName="cam1" />;
        }
        return <div className="h-full w-full flex items-center justify-center text-white/5 italic text-xs">{device.ipAddress} - Stream not configured</div>;
    };

    return (
        <div className="flex-grow flex flex-col gap-4 h-full relative">
            <div className="flex-grow overflow-hidden relative">
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto">
                    {devices.map((device) => (
                        <div key={device.id} className="aspect-video relative group bg-black rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-[var(--accent-blue)] transition-all">
                            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">{device.name}</div>
                            {renderStream(device)}
                        </div>
                    ))}
                </div>

                {selectedDevice && (
                    <div className="md:hidden h-full aspect-video relative group bg-black rounded-xl overflow-hidden ring-1 ring-white/10">
                        <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">{selectedDevice.name}</div>
                        {renderStream(selectedDevice)}
                    </div>
                )}
            </div>
        </div>
    );
};
