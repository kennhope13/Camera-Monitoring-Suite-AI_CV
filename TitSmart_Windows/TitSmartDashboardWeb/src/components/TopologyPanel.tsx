import { Panel } from './Panel';
import { Circle } from "lucide-react"; // Assuming Circle for camera markers

export const TopologyPanel = () => {
    return (
        <Panel title="SƠ ĐỒ TRẠM VÀ VỊ TRÍ CAMERA" className="h-full flex flex-col">
            <div className="flex-grow relative p-5">
                {/* Schematic Diagram */}
                <div className="w-full h-full relative rounded-xl overflow-hidden">
                    {/* Background schematic representation - using divs with lines */}
                    <div className="absolute inset-0 bg-[var(--panel-color)]">
                        {/* Example Lines representing connections or paths */}
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-px bg-gray-500/50 transform -rotate-45 origin-top-left"></div>
                        <div className="absolute top-1/2 left-1/4 w-1/2 h-px bg-gray-500/50 transform rotate-45 origin-top-left"></div>
                        <div className="absolute top-1/4 left-1/2 w-px h-1/2 bg-gray-500/50"></div>
                    </div>

                    {/* Camera Indicators */}
                    {/* Camera 1 */}
                    <div className="absolute top-[25%] left-[25%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white font-bold shadow-lg">1</div>
                        <p className="text-[9px] text-[var(--text-dim)] mt-1">CAM 1</p>
                    </div>
                    {/* Camera 2 */}
                    <div className="absolute top-[40%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold shadow-lg">2</div>
                        <p className="text-[9px] text-[var(--text-dim)] mt-1">CAM 2</p>
                    </div>
                    {/* Camera 3 */}
                    <div className="absolute top-[65%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">3</div>
                        <p className="text-[9px] text-[var(--text-dim)] mt-1">CAM 3</p>
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {/* Green pulsing dot */}
                        <span className="text-[9px] font-bold text-green-500 uppercase">CAMERA HOẠT ĐỘNG</span>
                    </div>
                </div>
            </div>
        </Panel>
    );
};
