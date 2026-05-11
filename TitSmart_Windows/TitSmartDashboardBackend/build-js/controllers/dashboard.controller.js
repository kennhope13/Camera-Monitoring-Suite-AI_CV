"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceById = exports.getDevices = exports.getStats = void 0;
const dashboardService = __importStar(require("../services/dashboard.service"));
const getStats = async (req, res) => {
    try {
        const stats = await dashboardService.getDashboardStats();
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};
exports.getStats = getStats;
const getDevices = async (req, res) => {
    try {
        const devices = await dashboardService.getDevices();
        res.json({ success: true, data: devices });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch devices' });
    }
};
exports.getDevices = getDevices;
const getDeviceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ success: false, message: 'Device ID is required' });
            return;
        }
        const device = await dashboardService.getDeviceById(id);
        if (!device) {
            res.status(404).json({ success: false, message: 'Device not found' });
            return;
        }
        res.json({ success: true, data: device });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch device details' });
    }
};
exports.getDeviceById = getDeviceById;
//# sourceMappingURL=dashboard.controller.js.map