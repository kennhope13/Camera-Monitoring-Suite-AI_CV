import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', dashboardController.getStats);
router.get('/devices', dashboardController.getDevices);
router.get('/devices/:id', dashboardController.getDeviceById);

export default router;
