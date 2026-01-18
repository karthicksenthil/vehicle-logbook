import { useState, useEffect } from 'react';
import { VehicleDatabase, QuickSelectVehicle } from '../types';
import { fetchVehicleData } from '../services/apiServices';

export function useVehicleForm() {
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [badge, setBadge] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [vehicleData, setVehicleData] = useState<VehicleDatabase>({});
  const [quickSelectVehicles, setQuickSelectVehicles] = useState<QuickSelectVehicle[]>([]);

  const makes = Object.keys(vehicleData);
  const models = make ? Object.keys(vehicleData[make] || {}) : [];
  const badges = make && model ? vehicleData[make]?.[model] || [] : [];

  useEffect(() => {
    loadVehicleData();
  }, []);

  const loadVehicleData = async () => {
    try {
      const data = await fetchVehicleData();
      setVehicleData(data.vehicleData);
      setQuickSelectVehicles(data.quickSelectVehicles);
    } catch (error) {
      console.error('Failed to load vehicle data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    setModel('');
    setBadge('');
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    setBadge('');
  };

  const handleBadgeChange = (newBadge: string) => {
    setBadge(newBadge);
  };

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile);
  };

  const handleQuickSelect = (vehicle: QuickSelectVehicle) => {
    setMake(vehicle.make);
    setModel(vehicle.model);
    setBadge(vehicle.badge);
  };

  const resetForm = () => {
    setMake('');
    setModel('');
    setBadge('');
    setFile(null);
  };

  const isValid = (): boolean => {
    return !!(make && model && badge && file);
  };

  return {
    make,
    model,
    badge,
    file,
    makes,
    models,
    badges,
    loading,
    quickSelectVehicles,
    handleMakeChange,
    handleModelChange,
    handleBadgeChange,
    handleFileChange,
    handleQuickSelect,
    resetForm,
    isValid
  };
}