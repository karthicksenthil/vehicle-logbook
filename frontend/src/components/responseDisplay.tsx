import { UploadResponse, ErrorResponse } from '../types';

interface ResponseDisplayProps {
  response: UploadResponse | ErrorResponse | null;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) return null;

  const isError = 'error' in response;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-3">Server Response:</h3>
      {isError ? (
        <p className="text-red-600">{response.error}</p>
      ) : (
        <div className="space-y-2">
          <p><strong>Make:</strong> {response.vehicle.make}</p>
          <p><strong>Model:</strong> {response.vehicle.model}</p>
          <p><strong>Badge:</strong> {response.vehicle.badge}</p>
          <div className="mt-3">
            <strong>Logbook Contents:</strong>
            <pre className="mt-2 p-3 bg-white rounded border border-gray-200 text-sm overflow-x-auto max-h-64 overflow-y-auto">
              {response.logbookContents}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}