import { QuickSelectVehicle } from '../types';

interface QuickSelectButtonsProps {
  vehicles: QuickSelectVehicle[];
  onQuickSelect: (vehicle: QuickSelectVehicle) => void;
}

export function QuickSelectButtons({ vehicles, onQuickSelect }: QuickSelectButtonsProps) {
  if (vehicles.length === 0) return null;

  return (
    <div className="bg-indigo-50 p-4 rounded-lg">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Select:</h2>
      <div className="flex gap-3 flex-wrap">
        {vehicles.map((vehicle, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onQuickSelect(vehicle)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {vehicle.label}
          </button>
        ))}
      </div>
    </div>
  );
}