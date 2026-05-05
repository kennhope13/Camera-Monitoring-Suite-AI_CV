import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import type { Device } from './types';

// Localization Dictionary
const i18n = {
  vi: {
    ops: "Trung Tâm Giám Sát Camera",
    surveillance: "Giám Sát Trực Tiếp",
    alerts: "Cảnh Báo AI",
    topo: "Sơ Đồ",
    plasma: "Phát hiện tia điện (Plasma)",
    object: "Phát hiện vật thể lạ",
    normal: "Hệ thống ổn định",
    status: "Hệ Thống Đang Hoạt Động"
  },
  en: {
    ops: "Camera Monitoring Suite",
    surveillance: "Live Surveillance",
    alerts: "AI Intelligence Alerts",
    topo: "Site Topology",
    plasma: "Plasma Flash Detected",
    object: "Foreign Object Identified",
    normal: "System Stable",
    status: "Operational System"
  }
};

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Panel = ({ title, children, className = "" }: PanelProps) => (
  <div className={`glass-panel rounded-2xl p-5 ${className}`}>
    {title && (
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">{title}</h2>
        <div className="h-[2px] w-6 bg-[var(--accent-blue)] rounded-full opacity-50" />
      </div>
    )}
    {children}
  </div>
);

const VideoColumn = ({ devices }: { devices: Device[] }) => (
  <div className="flex-grow overflow-y-auto h-full">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {devices.map((device) => (
        <div key={device.id} className="aspect-video relative group bg-black rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-[var(--accent-blue)] transition-all">
          <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wider">
            {device.name}
          </div>
          <div className="h-full w-full flex items-center justify-center text-white/5 italic text-xs">
            {device.ipAddress} - Stream
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AIAlertPanel = ({ t }: { t: any }) => (
  <Panel title={t.alerts} className="h-full overflow-hidden flex flex-col">
    <div className="flex-grow overflow-y-auto space-y-3 pr-1">
      {[
        { msg: t.plasma, time: "13:54:30", type: "PLASMA" },
        { msg: t.object, time: "12:10:05", type: "OBJECT" },
        { msg: t.normal, time: "11:00:00", type: "NORMAL" }
      ].map((ev, i) => (
        <div key={i} className={`p-4 rounded-xl border-l-4 transition-all duration-300 ${
          (ev.type === 'PLASMA' || ev.type === 'OBJECT') 
          ? 'bg-rose-500/20 border-rose-500 animate-pulse-slow shadow-lg shadow-rose-500/20' 
          : 'bg-black/5 dark:bg-black/20 border-emerald-500'
        }`}>
          <p className="text-[9px] text-[var(--text-dim)] uppercase font-bold mb-1">{ev.time}</p>
          <p className="font-bold text-sm text-[var(--text-main)] hover:text-white transition-colors">{ev.msg}</p>
        </div>
      ))}
    </div>
  </Panel>
);

const TopologyPanel = ({ devices, t }: { devices: Device[], t: any }) => (
    <Panel title={t.topo} className="h-full flex flex-col">
        <div className="flex-grow rounded-xl border border-[var(--border-color)] overflow-hidden relative shadow-inner">
            <img 
              src="/src/assets/map.png" 
              alt="Site Map" 
              className="w-full h-full object-contain rounded-xl" 
            />
        </div>
    </Panel>
);

const App = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [darkMode, setDarkMode] = useState(true);
  const [showAlerts, setShowAlerts] = useState(() => localStorage.getItem('showAlerts') !== 'false');
  const t = i18n[lang];

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);

  useEffect(() => { localStorage.setItem('showAlerts', String(showAlerts)); }, [showAlerts]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesData = await apiService.getDevices();
        setDevices(devicesData);
      } catch (error) { console.error(error); }
    };
    fetchDevices();
  }, []);

  return (
    <div className="h-screen flex flex-col p-6 gap-6 overflow-hidden bg-[var(--bg-color)]">
      <header className="flex items-center justify-between px-2 border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-1 bg-white rounded-2xl shadow-lg border border-[var(--border-color)]">
            <img src="/src/assets/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-[var(--text-main)]">TITSMART</h1>
            <p className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-[0.2em]">{t.ops}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setShowAlerts(!showAlerts)} className="relative p-2 hover:bg-[var(--accent-blue)] rounded-full transition">
            🔔 {showAlerts && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>
          <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} className="text-[10px] font-black px-4 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--accent-blue)] hover:text-white transition-all">
             {lang === 'vi' ? '🇻🇳 VI' : '🇺🇸 EN'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-[10px] font-black px-4 py-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--accent-blue)] hover:text-white transition-all">
            {darkMode ? 'DARK' : 'LIGHT'}
          </button>
        </div>
      </header>

      <main className="flex-grow flex gap-6 overflow-hidden">
        <div className="w-[20%] flex-none flex flex-col gap-5">
            <TopologyPanel devices={devices} t={t} />
        </div>
        <div className={`${showAlerts ? 'w-[65%]' : 'w-[80%]'} transition-all duration-300`}>
            <VideoColumn devices={devices} />
        </div>
        {showAlerts && (
            <div className="w-[15%] transition-all duration-300">
                <AIAlertPanel t={t} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
