import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

export const getDevices = async (req: Request, res: Response) => {
  try {
    const devices = await dashboardService.getDevices();
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch devices' });
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'Device ID is required' });
      return;
    }
    
    const device = await dashboardService.getDeviceById(id as string);
    if (!device) {
      res.status(404).json({ success: false, message: 'Device not found' });
      return;
    }
    
    res.json({ success: true, data: device });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch device details' });
  }
};
