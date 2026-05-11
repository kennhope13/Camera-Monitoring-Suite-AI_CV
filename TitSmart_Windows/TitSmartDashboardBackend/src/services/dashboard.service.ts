import { Device, DashboardStats } from '../types';
import fs from 'fs';
import path from 'path';
import ini from 'ini';

const getDevicesFromConfig = (): Device[] => {
  try {
    const configPath = path.join(__dirname, '../../../TitSmartDashboard/config.ini');
    if (!fs.existsSync(configPath)) {
      console.warn(`Config file not found at ${configPath}`);
      return [];
    }
    
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const parsed = ini.parse(configContent);
    
    const devices: Device[] = [];
    
    for (const key in parsed) {
      if (key.startsWith('Camera')) {
        const cam = parsed[key];
        devices.push({
          id: key,
          name: cam.Name || key,
          ipAddress: cam.IP || '',
          port: parseInt(cam.Port, 10) || 8000,
          username: cam.User || '',
          status: 'online', // Defaulting to online
          lastChecked: new Date(),
        });
      }
    }
    
    return devices;
  } catch (error) {
    console.error('Failed to parse config.ini', error);
    return [];
  }
};

export const getDevices = async (): Promise<Device[]> => {
  return getDevicesFromConfig();
};

export const getDeviceById = async (id: string): Promise<Device | undefined> => {
  const devices = getDevicesFromConfig();
  return devices.find(d => d.id === id);
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const devices = getDevicesFromConfig();
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = totalDevices - onlineDevices;
  
  return {
    totalDevices,
    onlineDevices,
    offlineDevices,
    activeAlarms: Math.floor(Math.random() * 5), // Mock random alarms
  };
};
