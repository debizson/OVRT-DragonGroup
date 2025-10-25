import { Settings, Info } from 'lucide-react';
import { useState } from 'react';
import { calculateDifficulty } from '../utils/difficultyCalculator';

interface CellData {
  type: string;
  color: string;
  icon: string;
}

interface PropertiesPanelProps {
  gridSize: { width: number; height: number };
  onGridSizeChange: (width: number, height: number) => void;
  cellCount: number;
  cells: Map<string, CellData>;
  generatedDifficulty?: 'easy' | 'medium' | 'hard' | 'very-hard' | null;
}

export default function PropertiesPanel({ gridSize, onGridSizeChange, cellCount, cells, generatedDifficulty }: PropertiesPanelProps) {
  const [localWidth, setLocalWidth] = useState(gridSize.width);
  const [localHeight, setLocalHeight] = useState(gridSize.height);

  const calculatedDifficulty = calculateDifficulty(cells, gridSize);
  
  const difficultyLabels = {
    'easy': { label: 'Könnyű', color: 'text-green-600' },
    'medium': { label: 'Közepes', color: 'text-yellow-600' },
    'hard': { label: 'Nehéz', color: 'text-orange-600' },
    'very-hard': { label: 'Nagyon nehéz', color: 'text-red-600' }
  };
  
  const displayDifficulty = generatedDifficulty 
    ? { level: difficultyLabels[generatedDifficulty].label, color: difficultyLabels[generatedDifficulty].color, score: calculatedDifficulty.score }
    : calculatedDifficulty;

  const handleWidthChange = (value: number) => {
    const newWidth = Math.min(Math.max(value, 10), 100);
    setLocalWidth(newWidth);
  };

  const handleHeightChange = (value: number) => {
    const newHeight = Math.min(Math.max(value, 10), 100);
    setLocalHeight(newHeight);
  };

  const handleApply = () => {
    onGridSizeChange(localWidth, localHeight);
  };

  const hasChanges = localWidth !== gridSize.width || localHeight !== gridSize.height;

  return (
    <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Tulajdonságok</span>
        </h3>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-3">Térkép beállítások</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Név</label>
              <input
                type="text"
                placeholder="Névtelen térkép"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Szélesség</label>
                <input
                  type="number"
                  value={localWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={10}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Magasság</label>
                <input
                  type="number"
                  value={localHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={10}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {hasChanges && (
              <button
                onClick={handleApply}
                className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Méret alkalmazása
              </button>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Leírás</label>
              <textarea
                placeholder="Add meg a térkép leírását..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-3">Kiválasztott objektum</h4>
          <div className="bg-gray-50 rounded-lg p-3 text-center text-gray-500 text-sm">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Nincs kiválasztva objektum</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-600 uppercase mb-3">Gyors statisztikák</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cellák:</span>
              <span className="font-semibold text-gray-900">{cellCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rács méret:</span>
              <span className="font-semibold text-gray-900">{gridSize.width} × {gridSize.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nehézség:</span>
              <span className={`font-semibold ${displayDifficulty.color}`}>{displayDifficulty.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nehézségi pont:</span>
              <span className="font-semibold text-gray-900">{displayDifficulty.score}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
