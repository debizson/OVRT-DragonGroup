import { useState } from 'react';
import { Save, Undo, Redo, Download, Trash2, Grid3x3, ZoomIn, ZoomOut } from 'lucide-react';
import GridCanvas from '../components/GridCanvas';
import Toolbar from '../components/Toolbar';
import PropertiesPanel from '../components/PropertiesPanel';

export default function EditorPage() {
  const [gridSize] = useState({ width: 30, height: 20 });
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string>('select');

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Mentés</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" title="Visszavonás">
            <Undo className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded" title="Újra">
            <Redo className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button className="p-2 hover:bg-gray-100 rounded" title="Exportálás">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded text-red-600" title="Törlés">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Grid3x3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">
              {gridSize.width} × {gridSize.height}
            </span>
          </div>
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
          <GridCanvas gridSize={gridSize} zoom={zoom} selectedTool={selectedTool} />
        </div>

        <PropertiesPanel />
      </div>
    </div>
  );
}
