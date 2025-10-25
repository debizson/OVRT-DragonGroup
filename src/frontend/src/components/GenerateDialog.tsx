import { X } from 'lucide-react';
import { useState } from 'react';

interface GenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (difficulty: 'easy' | 'medium' | 'hard' | 'very-hard') => void;
}

export default function GenerateDialog({ isOpen, onClose, onGenerate }: GenerateDialogProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'very-hard'>('medium');

  if (!isOpen) return null;

  const handleGenerate = () => {
    onGenerate(selectedDifficulty);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const difficulties = [
    { value: 'easy' as const, label: 'Könnyű', description: 'Kevés szörny, egyszerű elrendezés', color: 'border-green-500 text-green-600' },
    { value: 'medium' as const, label: 'Közepes', description: 'Kiegyensúlyozott kihívás', color: 'border-yellow-500 text-yellow-600' },
    { value: 'hard' as const, label: 'Nehéz', description: 'Több szörny, összetett labirintus', color: 'border-orange-500 text-orange-600' },
    { value: 'very-hard' as const, label: 'Nagyon nehéz', description: 'Extrém kihívás, sok veszély', color: 'border-red-500 text-red-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Véletlenszerű pálya generálása</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Válassz nehézségi szintet:
          </label>
          <div className="space-y-3">
            {difficulties.map((diff) => (
              <button
                key={diff.value}
                onClick={() => setSelectedDifficulty(diff.value)}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                  selectedDifficulty === diff.value
                    ? `${diff.color} bg-opacity-10 border-opacity-100`
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-bold text-lg ${selectedDifficulty === diff.value ? diff.color.split(' ')[1] : 'text-gray-900'}`}>
                      {diff.label}
                    </div>
                    <div className="text-sm text-gray-600">{diff.description}</div>
                  </div>
                  {selectedDifficulty === diff.value && (
                    <div className="w-5 h-5 rounded-full bg-current opacity-20"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Mégse
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Generálás
          </button>
        </div>
      </div>
    </div>
  );
}
