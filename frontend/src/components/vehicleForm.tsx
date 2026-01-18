import { useState } from 'react';    
import { Car } from 'lucide-react';
import { useVehicleForm } from '../hooks/useVehicleForm';
import { uploadVehicleLogbook } from '../services/apiServices';
import { QuickSelectButtons } from './quickSelectButton';
import { VehicleDropdowns } from './vehicleDropdown';
import { FileUpload } from './fileUpload';
import { ResponseDisplay } from './responseDisplay';
import { UploadResponse, ErrorResponse } from '../types';

export function VehicleForm() {
  const [response, setResponse] = useState<UploadResponse | ErrorResponse | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
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
    isValid
  } = useVehicleForm();

  const handleSubmit = async () => {
    if (!isValid()) {
      alert('Please complete all fields and upload a logbook file');
      return;
    }

    setUploading(true);
    setResponse(null);

    try {
      const data = await uploadVehicleLogbook({ make, model, badge }, file!);
      setResponse(data);
    } catch (error) {
      setResponse({ error: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading vehicle data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">Vehicle Logbook Upload</h1>
        </div>

        <div className="space-y-6">
          <QuickSelectButtons 
            vehicles={quickSelectVehicles}
            onQuickSelect={handleQuickSelect} 
          />

          <VehicleDropdowns
            make={make}
            model={model}
            badge={badge}
            makes={makes}
            models={models}
            badges={badges}
            onMakeChange={handleMakeChange}
            onModelChange={handleModelChange}
            onBadgeChange={handleBadgeChange}
          />
          {badge && (
            <div className="space-y-4">
              <FileUpload file={file} onFileChange={handleFileChange} />

              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
          
            </div>
          )}
        </div>

        <ResponseDisplay response={response} />

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This form requires a Node.js server running on port 3000.
          </p>
        </div>
      </div>
    </div>
  );
}