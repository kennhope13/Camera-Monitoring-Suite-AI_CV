"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getDeviceById = exports.getDevices = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ini_1 = __importDefault(require("ini"));
const getDevicesFromConfig = () => {
    try {
        const configPath = path_1.default.join(__dirname, '../../../TitSmartDashboard/config.ini');
        if (!fs_1.default.existsSync(configPath)) {
            console.warn(`Config file not found at ${configPath}`);
            return [];
        }
        const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
        const parsed = ini_1.default.parse(configContent);
        const devices = [];
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
    }
    catch (error) {
        console.error('Failed to parse config.ini', error);
        return [];
    }
};
const getDevices = async () => {
    return getDevicesFromConfig();
};
exports.getDevices = getDevices;
const getDeviceById = async (id) => {
    const devices = getDevicesFromConfig();
    return devices.find(d => d.id === id);
};
exports.getDeviceById = getDeviceById;
const getDashboardStats = async () => {
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
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=dashboard.service.js.map