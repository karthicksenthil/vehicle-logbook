import { Router } from 'express';
import { getVehicleData, getModelsForMake, getBadgesForModel } from '../controllers/vehicleController';

const router = Router();

// Get all vehicle data
router.get('/vehicles', getVehicleData);

// Get models for a specific make
router.get('/vehicles/:make/models', getModelsForMake);

// Get badges for a specific make and model
router.get('/vehicles/:make/:model/badges', getBadgesForModel);

export default router;