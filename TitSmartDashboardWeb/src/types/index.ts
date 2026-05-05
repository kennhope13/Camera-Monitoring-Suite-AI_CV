export interface Device {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  username: string;
  status: 'online' | 'offline' | 'error';
  lastChecked: string;
}

export interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlarms: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
