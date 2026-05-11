import type { DashboardStats, Device, ApiResponse } from '../types';

const API_BASE_URL = '/api';

export const apiService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const result: ApiResponse<DashboardStats> = await response.json();
    return result.data;
  },

  async getDevices(): Promise<Device[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/devices`);
    if (!response.ok) throw new Error('Failed to fetch devices');
    const result: ApiResponse<Device[]> = await response.json();
    return result.data;
  },
  
  async getDeviceById(id: string): Promise<Device> {
    const response = await fetch(`${API_BASE_URL}/dashboard/devices/${id}`);
    if (!response.ok) throw new Error('Failed to fetch device');
    const result: ApiResponse<Device> = await response.json();
    return result.data;
  }
};
