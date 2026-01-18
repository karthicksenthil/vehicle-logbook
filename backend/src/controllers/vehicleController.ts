import { Request, Response } from 'express';
import { vehicleData, quickSelectVehicles } from '../data/vehicleData';
import { VehicleDataResponse } from '../types';

/**
 * Get all vehicle data
 */
export function getVehicleData(req: Request, res: Response): void {
  const response: VehicleDataResponse = {
    makes: Object.keys(vehicleData),
    vehicleData,
    quickSelectVehicles
  };
  
  res.json(response);
}

/**
 * Get models for a specific make
 */
export function getModelsForMake(req: Request, res: Response): void {
  const { make } = req.params;
  
  if (!make || !vehicleData[make]) {
    res.status(404).json({
      error: `Make '${make}' not found`
    });
    return;
  }
  
  const models = Object.keys(vehicleData[make]);
  res.json({ make, models });
}

/**
 * Get badges for a specific make and model
 */
export function getBadgesForModel(req: Request, res: Response): void {
  const { make, model } = req.params;
  
  if (!make || !vehicleData[make]) {
    res.status(404).json({
      error: `Make '${make}' not found`
    });
    return;
  }
  
  if (!model || !vehicleData[make][model]) {
    res.status(404).json({
      error: `Model '${model}' not found for make '${make}'`
    });
    return;
  }
  
  const badges = vehicleData[make][model];
  res.json({ make, model, badges });
}