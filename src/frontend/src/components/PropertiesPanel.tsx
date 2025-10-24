import { Settings, Info } from 'lucide-react';

export default function PropertiesPanel() {
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
                  defaultValue={30}
                  min={5}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Magasság</label>
                <input
                  type="number"
                  defaultValue={20}
                  min={5}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

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
              <span className="text-gray-600">Objektumok:</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Szobák:</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nehézség:</span>
              <span className="font-semibold text-green-600">Könnyű</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
