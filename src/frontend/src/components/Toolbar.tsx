import { 
  MousePointer, 
  Square, 
  DoorOpen, 
  Box, 
  Armchair,
  BedDouble,
  Package,
  User,
  Skull,
  Eraser,
  Type,
  Grid3x3,
  Table,
  Mountain,
  Trees,
  Droplets,
  Flame,
  CircleSlash
} from 'lucide-react';

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  const tools = [
    { id: 'select', icon: <MousePointer />, label: 'Kijelölés', category: 'basic' },
    { id: 'wall', icon: <Square />, label: 'Fal (Tégla)', category: 'structure' },
    { id: 'stone-wall', icon: <Mountain />, label: 'Kőfal', category: 'structure' },
    { id: 'wood-wall', icon: <Box />, label: 'Fafal', category: 'structure' },
    { id: 'door', icon: <DoorOpen />, label: 'Ajtó', category: 'structure' },
    { id: 'window', icon: <Square />, label: 'Ablak', category: 'structure' },
    { id: 'floor', icon: <Grid3x3 />, label: 'Padló (Fű)', category: 'terrain' },
    { id: 'stone-floor', icon: <Mountain />, label: 'Kőpadló', category: 'terrain' },
    { id: 'wood-floor', icon: <Grid3x3 />, label: 'Fapadló', category: 'terrain' },
    { id: 'dirt', icon: <CircleSlash />, label: 'Föld', category: 'terrain' },
    { id: 'water', icon: <Droplets />, label: 'Víz', category: 'terrain' },
    { id: 'stairs', icon: <Square />, label: 'Lépcső', category: 'structure' },
    { id: 'table', icon: <Table />, label: 'Asztal', category: 'furniture' },
    { id: 'chair', icon: <Armchair />, label: 'Szék', category: 'furniture' },
    { id: 'bed', icon: <BedDouble />, label: 'Ágy', category: 'furniture' },
    { id: 'chest', icon: <Package />, label: 'Láda', category: 'furniture' },
    { id: 'torch', icon: <Flame />, label: 'Fáklya', category: 'decoration' },
    { id: 'tree', icon: <Trees />, label: 'Fa', category: 'decoration' },
    { id: 'character', icon: <User />, label: 'Karakter', category: 'entities' },
    { id: 'monster', icon: <Skull />, label: 'Szörny', category: 'entities' },
    { id: 'text', icon: <Type />, label: 'Szöveg', category: 'basic' },
    { id: 'erase', icon: <Eraser />, label: 'Törlés', category: 'basic' },
  ];

  const categories = [
    { id: 'basic', label: 'Alap' },
    { id: 'structure', label: 'Struktúra' },
    { id: 'terrain', label: 'Terep' },
    { id: 'furniture', label: 'Bútorok' },
    { id: 'decoration', label: 'Dekoráció' },
    { id: 'entities', label: 'Entitások' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Eszközök</h3>
        
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              {category.label}
            </h4>
            <div className="space-y-1">
              {tools
                .filter((tool) => tool.category === category.id)
                .map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onToolSelect(tool.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                      selectedTool === tool.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="w-5 h-5">{tool.icon}</div>
                    <span className="text-sm">{tool.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
