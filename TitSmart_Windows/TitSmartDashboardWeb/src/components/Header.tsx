import type { Device } from '@/types';
import { Wifi, Bell, User, Zap as LightningCharge } from "lucide-react";

interface HeaderProps {
    lang: 'vi' | 'en';
    setLang: (lang: 'vi' | 'en') => void;
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    devices: Device[];
    selectedId: string;
    setSelectedId: (id: string) => void;
    showAlerts: boolean;
    setShowAlerts: (showAlerts: boolean) => void;
    t: any;
}

export const Header = ({ lang, setLang, darkMode, setDarkMode, devices, selectedId, setSelectedId, showAlerts, setShowAlerts, t }: HeaderProps) => {
    return (
        <header className="flex flex-col gap-4 px-2 border-b border-[var(--border-color)] pb-4 md:pb-6">
            <div className="flex items-center justify-between">
                {/* Left Section: Logo and Title */}
                <div className="flex items-center gap-4">
                    <LightningCharge className="h-8 w-8 text-[var(--accent-blue)]" />
                    <div>
                        <h1 className="font-bold text-xl tracking-tight text-[var(--text-main)]">Substation Alpha-7</h1>
                        <p className="text-xs uppercase font-bold text-[var(--text-dim)] tracking-[0.2em]">HIGH VOLTAGE ZONE • ONLINE</p>
                    </div>
                </div>

                {/* Right Section: Icons */}
                <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <button onClick={() => setShowAlerts(!showAlerts)} className="relative p-2 hover:bg-[var(--accent-blue)] rounded-full transition text-muted-foreground">
                        <Bell className="h-5 w-5" />
                        {showAlerts && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer">
                        <User className="h-5 w-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
};
