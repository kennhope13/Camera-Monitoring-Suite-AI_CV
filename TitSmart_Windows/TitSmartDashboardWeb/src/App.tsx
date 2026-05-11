import { useState, useEffect } from 'react';
import { apiService } from './services/api';
import type { Device } from './types';
import { VideoColumn } from './components/VideoColumn';
import { AIAlertPanel } from './components/AIAlertPanel';
import { TopologyPanel } from './components/TopologyPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { Header } from './components/Header';
import { DashboardPage } from './components/DashboardPage';

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

const App = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [darkMode, setDarkMode] = useState(true);
  const [showAlerts, setShowAlerts] = useState<boolean>(() => {
    const saved = localStorage.getItem('showAlerts');
    return saved !== 'false';
  });
  const [selectedId, setSelectedId] = useState<string>('');
  const [showCameraMenu, setShowCameraMenu] = useState(false);

  const t = i18n[lang];

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);
  useEffect(() => { localStorage.setItem('showAlerts', String(showAlerts)); }, [showAlerts]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devicesData = await apiService.getDevices();
        setDevices(devicesData);
        if (devicesData.length > 0) setSelectedId(devicesData[0].id);
      } catch (error) { console.error(error); }
    };
    fetchDevices();
  }, []);

  return (
    <DashboardPage>
      <div className="h-full min-h-screen flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto md:overflow-hidden bg-[var(--bg-color)]">
        <Header 
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          devices={devices}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          showAlerts={showAlerts}
          setShowAlerts={setShowAlerts}
          t={t}
        />

        <main className="flex-grow flex flex-col gap-4 md:gap-6 overflow-visible">
          {/* Row 1: Video, Topology & Alerts */}
          <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-[70%] flex flex-col gap-2">
                      <div className="flex-none">
                          <VideoColumn devices={devices} selectedId={selectedId} />
                      </div>
                      {/* Topology & Analytics Row */}
                      <div className="w-full flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-1/2">
                              <TopologyPanel t={t} />
                          </div>
                          <div className="w-full md:w-1/2">
                              <AnalyticsPanel t={t} />
                          </div>
                      </div>
                  </div>
                  {/* Desktop Side Alerts */}
                  <div className="hidden md:block w-full md:w-[30%]">
                      <AIAlertPanel t={t} />
                  </div>
              </div>
          </div>

          {/* Mobile Alert Overlay */}
          {showAlerts && (
              <div 
                  className="md:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] transition-all duration-300"
                  onClick={() => setShowAlerts(false)}
              >
                  <div 
                      className="w-full max-w-sm bg-[var(--panel-color)] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
                      onClick={(e) => e.stopPropagation()}
                  >
                      <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
                          <span className="font-bold text-[var(--text-main)] uppercase tracking-widest text-xs">AI ALERTS</span>
                          <button onClick={() => setShowAlerts(false)} className="p-1 text-2xl font-light text-[var(--text-main)] hover:text-[var(--accent-blue)]">✕</button>
                      </div>
                      <AIAlertPanel t={t} />
                  </div>
              </div>
          )}
        </main>
      </div>
    </DashboardPage>
  );
};

export default App;
