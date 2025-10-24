import { BarChart, TrendingUp, Package, Users } from 'lucide-react';

export default function StatsPage() {
  const stats = {
    totalMaps: 12,
    totalObjects: 342,
    averageObjectsPerRoom: 5.2,
    mostUsedObject: 'Ajtó',
    mostUsedObjectCount: 48,
  };

  const objectDistribution = [
    { name: 'Ajtó', count: 48, color: 'bg-blue-500' },
    { name: 'Fal', count: 156, color: 'bg-gray-500' },
    { name: 'Asztal', count: 23, color: 'bg-brown-500' },
    { name: 'Szék', count: 45, color: 'bg-yellow-600' },
    { name: 'Ágy', count: 18, color: 'bg-purple-500' },
    { name: 'Láda', count: 31, color: 'bg-green-600' },
    { name: 'Egyéb', count: 21, color: 'bg-indigo-500' },
  ];

  const difficultyDistribution = [
    { level: 'Könnyű', count: 4, color: 'bg-green-500' },
    { level: 'Közepes', count: 5, color: 'bg-yellow-500' },
    { level: 'Nehéz', count: 3, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Statisztikák</h1>
          <p className="text-gray-600">Részletes elemzések a térképeidről és objektumaidról</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BarChart className="w-8 h-8" />}
            label="Összes térkép"
            value={stats.totalMaps}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Package className="w-8 h-8" />}
            label="Összes objektum"
            value={stats.totalObjects}
            color="bg-purple-500"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Átlag objektum/szoba"
            value={stats.averageObjectsPerRoom.toFixed(1)}
            color="bg-green-500"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            label="Leggyakoribb objektum"
            value={stats.mostUsedObject}
            subtitle={`${stats.mostUsedObjectCount} db`}
            color="bg-orange-500"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Objektum eloszlás</h2>
            <div className="space-y-4">
              {objectDistribution.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className="text-gray-900 font-bold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all`}
                      style={{
                        width: `${(item.count / Math.max(...objectDistribution.map(o => o.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nehézségi szint eloszlás</h2>
            <div className="space-y-6">
              {difficultyDistribution.map((item) => (
                <div key={item.level} className="flex items-center space-x-4">
                  <div className={`${item.color} text-white px-4 py-2 rounded-lg font-bold text-lg w-32 text-center`}>
                    {item.level}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-8">
                      <div
                        className={`${item.color} h-8 rounded-full flex items-center justify-end pr-3 text-white font-bold transition-all`}
                        style={{
                          width: `${(item.count / stats.totalMaps) * 100}%`
                        }}
                      >
                        {item.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon, label, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4">
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
