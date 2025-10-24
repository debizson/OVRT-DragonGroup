import { useState } from 'react';
import { Search, Filter, Clock, Grid3x3 } from 'lucide-react';

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const maps = [
    {
      id: '1',
      name: 'Sárkány Barlangjа',
      thumbnail: '🏰',
      size: { width: 30, height: 20 },
      lastModified: '2025-10-20',
      difficulty: 'Közepes',
    },
    {
      id: '2',
      name: 'Erdei Kunyhó',
      thumbnail: '🌲',
      size: { width: 15, height: 15 },
      lastModified: '2025-10-19',
      difficulty: 'Könnyű',
    },
    {
      id: '3',
      name: 'Temetkezési Kripta',
      thumbnail: '⚰️',
      size: { width: 40, height: 25 },
      lastModified: '2025-10-18',
      difficulty: 'Nehéz',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentett Térképek</h1>
          <p className="text-gray-600">Böngészd és szerkeszd a korábban létrehozott térképeidet</p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Keresés térképek között..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Szűrők</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {maps.map((map) => (
            <MapCard key={map.id} map={map} />
          ))}
        </div>

        {maps.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Még nincsenek mentett térképek</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface MapCardProps {
  map: {
    id: string;
    name: string;
    thumbnail: string;
    size: { width: number; height: number };
    lastModified: string;
    difficulty: string;
  };
}

function MapCard({ map }: MapCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer">
      <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-6xl">
        {map.thumbnail}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{map.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Grid3x3 className="w-4 h-4" />
            <span>{map.size.width} × {map.size.height}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{map.lastModified}</span>
          </div>
          <div>
            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {map.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
