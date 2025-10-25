import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Save, Undo, Redo, Download, Trash2, Grid3x3, ZoomIn, ZoomOut } from 'lucide-react';
import GridCanvas from '../components/GridCanvas';
import Toolbar from '../components/Toolbar';
import PropertiesPanel from '../components/PropertiesPanel';
import ExportDialog from '../components/ExportDialog';
import { generateRandomMap } from '../utils/mapGenerator';

interface CellData {
  type: string;
  color: string;
  icon: string;
}

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [gridSize, setGridSize] = useState({ width: 30, height: 20 });
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [cells, setCells] = useState<Map<string, CellData>>(new Map());
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDimensionDialog, setShowDimensionDialog] = useState(false);
  const [generatedDifficulty, setGeneratedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'very-hard' | null>(null);
  
  const history = useRef<Map<string, CellData>[]>([new Map()]);
  const historyIndex = useRef(0);
  const lastGeneratedDifficulty = useRef<string | null>(null);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  const updateCellsWithHistory = useCallback((newCells: Map<string, CellData>) => {
    historyIndex.current += 1;
    history.current = history.current.slice(0, historyIndex.current);
    history.current.push(new Map(newCells));
    
    if (history.current.length > 50) {
      history.current.shift();
      historyIndex.current -= 1;
    }
    
    setCells(newCells);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      const previousState = history.current[historyIndex.current];
      setCells(new Map(previousState));
      console.log('Visszavonás - history index:', historyIndex.current);
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current += 1;
      const nextState = history.current[historyIndex.current];
      setCells(new Map(nextState));
      console.log('Újra - history index:', historyIndex.current);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const difficultyParam = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' | 'very-hard' | null;
    const difficulty = difficultyParam || 'medium';
    
    console.log('Mode:', mode, 'Difficulty param:', difficultyParam, 'Final difficulty:', difficulty);
    console.log('Last generated difficulty:', lastGeneratedDifficulty.current);
    
    if (mode === 'generate') {
      if (lastGeneratedDifficulty.current !== difficulty) {
        console.log(`Generálás előtt - difficulty: ${difficulty}, lastGenerated: ${lastGeneratedDifficulty.current}`);
        const generatedMap = generateRandomMap(gridSize.width, gridSize.height, difficulty);
        updateCellsWithHistory(generatedMap);
        lastGeneratedDifficulty.current = difficulty;
        setGeneratedDifficulty(difficulty);
        console.log(`Véletlenszerű térkép generálva (${difficulty})!`);
      } else {
        console.log(`Már létezik ${difficulty} nehézségű térkép, nem generálunk újat`);
      }
    } else {
      lastGeneratedDifficulty.current = null;
      setGeneratedDifficulty(null);
    }
  }, [searchParams, gridSize, updateCellsWithHistory]);

  useEffect(() => {
    const loadedMap = (location.state as any)?.loadedMap;
    if (loadedMap) {
      try {
        if (loadedMap.gridSize) {
          setGridSize(loadedMap.gridSize);
        }
        if (loadedMap.zoom) {
          setZoom(loadedMap.zoom);
        }
        if (loadedMap.cells && Array.isArray(loadedMap.cells)) {
          const newCells = new Map<string, CellData>();
          loadedMap.cells.forEach((cell: any) => {
            const key = `${cell.x},${cell.y}`;
            newCells.set(key, {
              type: cell.type,
              color: cell.color,
              icon: cell.icon
            });
          });
          updateCellsWithHistory(newCells);
          console.log('Térkép betöltve:', loadedMap.cellCount || newCells.size, 'cella');
        }
      } catch (error) {
        console.error('Hiba a térkép betöltésekor:', error);
        alert('Hiba történt a térkép betöltése közben!');
      }
    }
  }, [location.state, updateCellsWithHistory]);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  const handleSave = () => {
    const mapData = {
      gridSize,
      zoom,
      cells: Array.from(cells.entries()).map(([key, value]) => {
        const [x, y] = key.split(',').map(Number);
        return {
          x,
          y,
          ...value
        };
      }),
      timestamp: new Date().toISOString(),
      cellCount: cells.size
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `dnd-map-${timestamp}`;
    
    const jsonString = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('Térkép mentve:', fileName);
    console.log('Összesen cellák:', cells.size);
  };

  const handleExport = (fileName: string, format: 'png' | 'pdf' | 'json') => {
    console.log(`Exportálás: ${fileName}.${format}`);
    
    const mapData = {
      gridSize,
      zoom,
      cells: Array.from(cells.entries()).map(([key, value]) => {
        const [x, y] = key.split(',').map(Number);
        return {
          x,
          y,
          ...value
        };
      }),
      timestamp: new Date().toISOString(),
      cellCount: cells.size
    };

    if (format === 'json') {
      const jsonString = JSON.stringify(mapData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('JSON exportálva:', fileName);
    } else if (format === 'png') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.png`;
            link.click();
            URL.revokeObjectURL(url);
            console.log('PNG exportálva:', fileName);
          }
        });
      }
    } else if (format === 'pdf') {
      console.log('PDF exportálás (implementáció folyamatban...)');
      alert('PDF exportálás hamarosan elérhető lesz!');
    }
  };

  const handleUpdateDimensions = (newWidth: number, newHeight: number) => {
    setGridSize({ width: newWidth, height: newHeight });
    setShowDimensionDialog(false);
    console.log(`Rács mérete frissítve: ${newWidth} × ${newHeight}`);
  };

  const handleDeleteMap = () => {
    const newCells = new Map<string, CellData>();
    updateCellsWithHistory(newCells);
    setGeneratedDifficulty(null);
    setShowDeleteConfirm(false);
    console.log('Térkép törölve - összes cella eltávolítva');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={handleSave} className="btn-secondary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Mentés</span>
          </button>
          <button 
            onClick={handleUndo} 
            disabled={!canUndo}
            className={`p-2 rounded ${canUndo ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`} 
            title="Visszavonás"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button 
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded ${canRedo ? 'hover:bg-gray-100' : 'opacity-40 cursor-not-allowed'}`}
            title="Újra"
          >
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button 
            onClick={() => setIsExportDialogOpen(true)} 
            className="p-2 hover:bg-gray-100 rounded" 
            title="Exportálás"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)} 
            className="p-2 hover:bg-gray-100 rounded text-red-600" 
            title="Törlés"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowDimensionDialog(true)}
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-1 transition-colors"
            title="Rács méretének módosítása"
          >
            <Grid3x3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {gridSize.width} × {gridSize.height}
            </span>
          </button>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
            <button onClick={handleZoomOut} className="p-1 hover:bg-gray-200 rounded">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-gray-200 rounded">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

        <div className="flex-1 overflow-auto bg-gray-200 p-4">
          <GridCanvas 
            gridSize={gridSize} 
            zoom={zoom} 
            selectedTool={selectedTool}
            cells={cells}
            setCells={updateCellsWithHistory}
          />
        </div>

        <PropertiesPanel 
          gridSize={gridSize}
          onGridSizeChange={handleUpdateDimensions}
          cellCount={cells.size}
          cells={cells}
          generatedDifficulty={generatedDifficulty}
        />
      </div>

      <ExportDialog 
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Térkép törlése
              </h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Biztosan törölni szeretnéd az összes elemet a térképről? Ez a művelet nem vonható vissza.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Mégse
                </button>
                <button
                  onClick={handleDeleteMap}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Törlés
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDimensionDialog && (
        <DimensionDialog
          currentWidth={gridSize.width}
          currentHeight={gridSize.height}
          onClose={() => setShowDimensionDialog(false)}
          onUpdate={handleUpdateDimensions}
        />
      )}
    </div>
  );
}

interface DimensionDialogProps {
  currentWidth: number;
  currentHeight: number;
  onClose: () => void;
  onUpdate: (width: number, height: number) => void;
}

function DimensionDialog({ currentWidth, currentHeight, onClose, onUpdate }: DimensionDialogProps) {
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);

  const handleSubmit = () => {
    if (width >= 10 && width <= 100 && height >= 10 && height <= 100) {
      onUpdate(width, height);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full">
            <Grid3x3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Rács méretének módosítása
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6">
            Állítsd be a térkép szélességét és magasságát (10-100 között)
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                Szélesség: {width}
              </label>
              <input
                id="width"
                type="range"
                min="10"
                max="100"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                Magasság: {height}
              </label>
              <input
                id="height"
                type="range"
                min="10"
                max="100"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>10</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Mégse
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Alkalmazás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
