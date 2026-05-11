import { Panel } from './Panel';

export const AIAlertPanel = ({ t }: { t: { alerts: string, plasma: string, object: string, normal: string } }) => {
    const alerts = [
        { msg: t.plasma, time: "13:54", type: "PLASMA", priority: 1 },
        { msg: t.object, time: "12:10", type: "OBJECT", priority: 1 },
        { msg: t.normal, time: "11:00", type: "NORMAL", priority: 0 }
    ];

    const criticalCount = alerts.filter(a => a.priority === 1).length;

    return (
        <Panel title={t.alerts} className="h-full overflow-hidden flex flex-col">
            {/* Summary Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${criticalCount > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {criticalCount} {criticalCount > 1 ? 'Alerts' : 'Alert'}
                </div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {alerts.map((ev, i) => (
                    <div key={i} className={`p-3 rounded-xl border-l-[3px] flex gap-3 transition-all ${
                        ev.priority === 1
                        ? 'bg-rose-500/10 border-rose-500' 
                        : 'bg-black/5 dark:bg-white/5 border-emerald-500'
                    }`}>
                        <div className={`text-lg mt-0.5 ${ev.priority === 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {ev.type === 'PLASMA' ? '⚡' : ev.type === 'OBJECT' ? '🔍' : '✅'}
                        </div>
                        <div className="flex-grow">
                            <p className="text-[9px] text-[var(--text-dim)] font-bold">{ev.time}</p>
                            <p className="font-bold text-sm text-[var(--text-main)] leading-tight">{ev.msg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
};
