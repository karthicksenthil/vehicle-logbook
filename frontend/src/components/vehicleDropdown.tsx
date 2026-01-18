interface VehicleDropdownsProps {
  make: string;
  model: string;
  badge: string;
  makes: string[];
  models: string[];
  badges: string[];
  onMakeChange: (make: string) => void;
  onModelChange: (model: string) => void;
  onBadgeChange: (badge: string) => void;
}

export function VehicleDropdowns({
  make,
  model,
  badge,
  makes,
  models,
  badges,
  onMakeChange,
  onModelChange,
  onBadgeChange
}: VehicleDropdownsProps) {
  return (
    <>
      <div>
        <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
          Make *
        </label>
        <select
          value={make}
          onChange={(e) => onMakeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          id="make"
        >
          <option value="">Select a make</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          Model *
        </label>
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          disabled={!make}
          id="model"
        >
          <option value="">Select a model</option>
          {models.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-2">
          Badge *
        </label>
        <select
          value={badge}
          onChange={(e) => onBadgeChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
          disabled={!model}
          id="badge"
        >
          <option value="">Select a badge</option>
          {badges.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
    </>
  );
}