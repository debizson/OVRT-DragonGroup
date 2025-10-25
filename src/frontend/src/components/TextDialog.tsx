import { X } from 'lucide-react';
import { useState } from 'react';

interface TextDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string) => void;
  initialText?: string;
}

export default function TextDialog({ isOpen, onClose, onConfirm, initialText = '' }: TextDialogProps) {
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (text.trim()) {
      onConfirm(text);
      setText('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Szöveg hozzáadása</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Írj be egy szöveget:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pl: Bejárat, Kincsesláda, stb."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
            maxLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 20 karakter</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Mégse
          </button>
          <button
            onClick={handleConfirm}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Hozzáad
          </button>
        </div>
      </div>
    </div>
  );
}
