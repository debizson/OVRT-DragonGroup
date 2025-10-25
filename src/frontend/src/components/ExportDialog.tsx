import { useState } from 'react';
import { X, Download } from 'lucide-react';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (fileName: string, format: 'png' | 'pdf' | 'json') => void;
}

export default function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [fileName, setFileName] = useState('terkep');
  const [format, setFormat] = useState<'png' | 'pdf' | 'json'>('png');

  if (!isOpen) return null;

  const handleExport = () => {
    if (fileName.trim()) {
      onExport(fileName.trim(), format);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExport();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Térkép exportálása</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
              Fájl neve
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Fájl neve"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formátum
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="png"
                  checked={format === 'png'}
                  onChange={(e) => setFormat(e.target.value as 'png')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">PNG kép</div>
                  <div className="text-xs text-gray-500">Raszteres kép formátum</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={(e) => setFormat(e.target.value as 'pdf')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">PDF dokumentum</div>
                  <div className="text-xs text-gray-500">Nyomtatható formátum</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={format === 'json'}
                  onChange={(e) => setFormat(e.target.value as 'json')}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">JSON adat</div>
                  <div className="text-xs text-gray-500">Térkép adatok újratöltéshez</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Mégse
          </button>
          <button
            onClick={handleExport}
            disabled={!fileName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportálás
          </button>
        </div>
      </div>
    </div>
  );
}
