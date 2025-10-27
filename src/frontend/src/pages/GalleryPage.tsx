import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Grid3x3 } from 'lucide-react';

// define the structure of the map data received from the api
interface ApiMapData {
  name: string;
  difficulty: string;
}
const difficultyTranslation: { [key: string]: string } = {
  EASY: 'Könnyű',
  MEDIUM: 'Közepes',
  HARD: 'Nehéz',
  VERY_HARD: 'Nagyon nehéz',
};

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [maps, setMaps] = useState<ApiMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaps = async () => {
      console.log("GalleryPage: Attempting to fetch maps...");
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/maps`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiMapData[] = await response.json();
        console.log("GalleryPage: Successfully fetched maps:", data);
        setMaps(data);
      } catch (e) {
        console.error("GalleryPage: Failed to fetch maps.", e);
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaps();
  }, []); 
  // map filter, name based
  const filteredMaps = maps.filter(map => 
    map.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {loading && <div className="text-center py-16"><p className="text-gray-500 text-lg">Térképek betöltése...</p></div>}
        {error && <div className="text-center py-16"><p className="text-red-500 text-lg">Hiba a térképek betöltése közben: {error}</p></div>}

        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMaps.map((map) => (
                <Link 
                  to={`/editor?loadMap=${encodeURIComponent(map.name)}`} 
                  key={map.name}
                >
                  <MapCard map={{
                    id: map.name, 
                    name: map.name,
                    difficulty: difficultyTranslation[map.difficulty] || map.difficulty,
                    thumbnail: '🗺️',
                    size: { width: 25, height: 25 },
                    lastModified: 'N/A',
                  }} />
                </Link>
              ))}
            </div>

            {filteredMaps.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Még nincsenek mentett térképek</p>
              </div>
            )}
          </>
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