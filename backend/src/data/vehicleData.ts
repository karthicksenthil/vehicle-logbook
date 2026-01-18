import { VehicleDatabase, QuickSelectVehicle } from '../types';

export const vehicleData: VehicleDatabase = {
  'Ford' : {
    'Ranger': ['Raptor', 'Raptor X', 'Wildtrak'],
    'Falcon': ['XR6', 'XR6 Turbo', 'XR8'],
    'Falcon Ute': ['XR6', 'XR6 Turbo']
  },
  'BMW' : {
    '130d': ['xDrive 26d', 'xDrive 30d'],
    '240i': ['xDrive 30d', 'xDrive 50d'],
    '320e': ['xDrive 75d', 'xDrive 80d', 'xDrive 85d']
  },
  'Tesla' : {
    'Model 3': ['Performance', 'Long Range', 'Dual Motor'],
  },
  
};

export const quickSelectVehicles: QuickSelectVehicle[] = [
  { make: 'Tesla', model: 'Model 3', badge: 'Performance', label: 'Tesla Model 3 Performance' },
  { make: 'Ford', model: 'Ranger', badge: 'Wildtrak', label: 'Ford Ranger Wildtrak' }
];