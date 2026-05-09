import { Panel } from './Panel';

export const AnalyticsPanel = () => {
    // Dummy data for the graph
    const graphData = {
        current: [
            { x: 0, y: 20 },
            { x: 6, y: 30 },
            { x: 12, y: 50 },
            { x: 18, y: 40 },
            { x: 24, y: 60 },
        ],
        forecast: [
            { x: 0, y: 15 },
            { x: 6, y: 25 },
            { x: 12, y: 45 },
            { x: 18, y: 35 },
            { x: 24, y: 55 },
        ],
    };

    // Function to generate path data for SVG
    const generatePath = (data: { x: number, y: number }[]) => {
        let path = `M ${data[0].x * 10} ${100 - data[0].y}`;
        data.slice(1).forEach(point => {
            path += ` L ${point.x * 10} ${100 - point.y}`;
        });
        return path;
    };

    return (
        <Panel title="ĐỘ ỔN ĐỊNH HỆ THỐNG (24H)" className="h-full flex flex-col">
            <div className="flex-grow relative p-5">
                {/* Graph Area */}
                <div className="absolute inset-0">
                    <svg viewBox="0 0 240 100" className="w-full h-full" preserveAspectRatio="none">
                        {/* X-axis labels */}
                        <g className="text-[9px] text-[var(--text-dim)]">
                            <text x="0" y="105">00:00</text>
                            <text x="60" y="105" textAnchor="middle">06:00</text>
                            <text x="120" y="105" textAnchor="middle">12:00</text>
                            <text x="180" y="105" textAnchor="middle">18:00</text>
                            <text x="240" y="105" textAnchor="end">24:00</text>
                        </g>

                        {/* Forecast Line */}
                        <path
                            d={generatePath(graphData.forecast)}
                            fill="none"
                            stroke="var(--text-dim)"
                            strokeDasharray="4,2"
                            strokeWidth="1.5"
                        />
                        {/* Current Line */}
                        <path
                            d={generatePath(graphData.current)}
                            fill="none"
                            stroke="var(--accent-blue)"
                            strokeWidth="2"
                        />
                    </svg>
                </div>

                {/* Labels for Current and Forecast */}
                <div className="absolute top-3 left-5 z-10 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[var(--accent-blue)]"></span>
                    <span className="text-[9px] font-bold text-[var(--text-main)] uppercase">HIỆN TẠI</span>
                    <span className="w-3 h-3 rounded-full bg-[var(--text-dim)] opacity-70"></span>
                    <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase">DỰ BÁO</span>
                </div>

                {/* Metrics Section at the bottom */}
                <div className="relative z-10 grid grid-cols-2 gap-4 pt-4 pb-2 px-3 bg-[var(--panel-color)] rounded-b-2xl">
                    <div>
                        <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-wide">MỨC RỦI RO HIỆN TẠI</p>
                        <p className="text-xl font-bold text-[var(--text-main)]">0.05%</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-wide">CHỈ SỐ KPI</p>
                        <p className="text-xl font-bold text-[var(--text-main)]">99.98</p>
                    </div>
                </div>
            </div>
        </Panel>
    );
};
