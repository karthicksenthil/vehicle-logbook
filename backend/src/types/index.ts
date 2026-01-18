export interface VehicleData {
  make: string;
  model: string;
  badge: string;
}

export interface VehicleDatabase {
  [make: string]: {
    [model: string]: string[];
  };
}

export interface QuickSelectVehicle extends VehicleData {
  label: string;
}

export interface UploadResponse {
  vehicle: VehicleData;
  logbookContents: string;
  uploadedAt: string;
  filename: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface VehicleDataResponse {
  makes: string[];
  vehicleData: VehicleDatabase;
  quickSelectVehicles: QuickSelectVehicle[];
}

export interface ErrorResponse {
  error: string;
  details?: string[];
}