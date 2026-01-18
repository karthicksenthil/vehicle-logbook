import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/plain') {
      onFileChange(selectedFile);
    } else if (selectedFile) {
      alert('Please select a plain text file (.txt)');
      e.target.value = '';
    }
  };

  return (
    <div>
      <label htmlFor='service-logbook' className="block text-sm font-medium text-gray-700 mb-2">
        Service Logbook (.txt) *
      </label>
      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-indigo-500 transition-colors">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Choose a file...'}
            </span>
          </div>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
            id="service-logbook"
          />
        </label>
      </div>
    </div>
  );
}