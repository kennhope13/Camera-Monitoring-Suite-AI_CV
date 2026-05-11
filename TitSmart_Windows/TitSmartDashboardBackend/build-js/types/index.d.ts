export interface Device {
    id: string;
    name: string;
    ipAddress: string;
    port: number;
    username: string;
    status: 'online' | 'offline' | 'error';
    lastChecked: Date;
}
export interface DashboardStats {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    activeAlarms: number;
}
//# sourceMappingURL=index.d.ts.map