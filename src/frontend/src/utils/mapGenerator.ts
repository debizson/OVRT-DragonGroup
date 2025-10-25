interface CellData {
  type: string;
  color: string;
  icon: string;
}

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateRandomMap(gridWidth: number, gridHeight: number): Map<string, CellData> {
  const cells = new Map<string, CellData>();
  const rooms: Room[] = [];
  const numRooms = Math.floor(Math.random() * 5) + 4;
  
  for (let i = 0; i < numRooms; i++) {
    const attempts = 100;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const width = Math.floor(Math.random() * 6) + 4;
      const height = Math.floor(Math.random() * 6) + 4;
      const x = Math.floor(Math.random() * (gridWidth - width - 2)) + 1;
      const y = Math.floor(Math.random() * (gridHeight - height - 2)) + 1;
      
      const newRoom: Room = { x, y, width, height };
      
      if (!rooms.some(room => roomsOverlap(room, newRoom))) {
        rooms.push(newRoom);
        break;
      }
    }
  }
  
  rooms.forEach(room => {
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        if (x === room.x || x === room.x + room.width - 1 || 
            y === room.y || y === room.y + room.height - 1) {
          cells.set(`${x},${y}`, { type: 'wall', color: '#6b7280', icon: '' });
        } else {
          const floorTypes = ['floor', 'stone-floor', 'wood-floor'];
          const floorType = floorTypes[Math.floor(Math.random() * floorTypes.length)];
          cells.set(`${x},${y}`, { 
            type: floorType, 
            color: floorType === 'floor' ? '#f3f4f6' : floorType === 'stone-floor' ? '#808080' : '#d2691e', 
            icon: '' 
          });
        }
      }
    }
  });
  
  for (let i = 0; i < rooms.length - 1; i++) {
    const room1 = rooms[i];
    const room2 = rooms[i + 1];
    
    const center1x = Math.floor(room1.x + room1.width / 2);
    const center1y = Math.floor(room1.y + room1.height / 2);
    const center2x = Math.floor(room2.x + room2.width / 2);
    const center2y = Math.floor(room2.y + room2.height / 2);
    
    if (Math.random() > 0.5) {
      createHorizontalCorridor(cells, center1x, center2x, center1y);
      createVerticalCorridor(cells, center1y, center2y, center2x);
    } else {
      createVerticalCorridor(cells, center1y, center2y, center1x);
      createHorizontalCorridor(cells, center1x, center2x, center2y);
    }
  }
  
  rooms.forEach((room, index) => {
    if (index === 0) {
      const doorX = room.x + Math.floor(room.width / 2);
      const doorY = room.y;
      cells.set(`${doorX},${doorY}`, { type: 'door', color: '#92400e', icon: '' });
    } else {
      const walls = [];
      for (let x = room.x + 1; x < room.x + room.width - 1; x++) {
        walls.push({ x, y: room.y });
        walls.push({ x, y: room.y + room.height - 1 });
      }
      for (let y = room.y + 1; y < room.y + room.height - 1; y++) {
        walls.push({ x: room.x, y });
        walls.push({ x: room.x + room.width - 1, y });
      }
      
      if (walls.length > 0) {
        const randomWall = walls[Math.floor(Math.random() * walls.length)];
        cells.set(`${randomWall.x},${randomWall.y}`, { type: 'door', color: '#92400e', icon: '' });
      }
    }
  });
  
  rooms.forEach((room) => {
    if (Math.random() > 0.3) {
      const numObjects = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numObjects; i++) {
        const x = room.x + Math.floor(Math.random() * (room.width - 2)) + 1;
        const y = room.y + Math.floor(Math.random() * (room.height - 2)) + 1;
        const key = `${x},${y}`;
        
        if (cells.has(key) && cells.get(key)?.type.includes('floor')) {
          const objects = [
            { type: 'furniture', color: '#fef3c7', icon: '🍽' },
            { type: 'furniture', color: '#fef3c7', icon: '🪑' },
            { type: 'furniture', color: '#fef3c7', icon: '🛏️' },
            { type: 'furniture', color: '#fef3c7', icon: '📦' },
            { type: 'decoration', color: '#fff3cd', icon: '🔥' },
          ];
          const obj = objects[Math.floor(Math.random() * objects.length)];
          
          const originalCell = cells.get(key);
          if (originalCell) {
            cells.set(key, obj);
          }
        }
      }
    }
  });
  
  const numMonsters = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numMonsters; i++) {
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const x = room.x + Math.floor(Math.random() * (room.width - 2)) + 1;
    const y = room.y + Math.floor(Math.random() * (room.height - 2)) + 1;
    const key = `${x},${y}`;
    
    if (cells.has(key) && cells.get(key)?.type.includes('floor')) {
      cells.set(key, { type: 'entity', color: '#fee2e2', icon: '👹' });
    }
  }
  
  console.log(`Térkép generálva: ${rooms.length} szoba, ${cells.size} cella`);
  return cells;
}

function roomsOverlap(room1: Room, room2: Room): boolean {
  return !(
    room1.x + room1.width + 1 < room2.x ||
    room2.x + room2.width + 1 < room1.x ||
    room1.y + room1.height + 1 < room2.y ||
    room2.y + room2.height + 1 < room1.y
  );
}

function createHorizontalCorridor(
  cells: Map<string, CellData>,
  x1: number,
  x2: number,
  y: number
) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  
  for (let x = minX; x <= maxX; x++) {
    const key = `${x},${y}`;
    if (!cells.has(key) || cells.get(key)?.type === 'wall') {
      cells.set(key, { type: 'stone-floor', color: '#808080', icon: '' });
    }
  }
}

function createVerticalCorridor(
  cells: Map<string, CellData>,
  y1: number,
  y2: number,
  x: number
) {
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  for (let y = minY; y <= maxY; y++) {
    const key = `${x},${y}`;
    if (!cells.has(key) || cells.get(key)?.type === 'wall') {
      cells.set(key, { type: 'stone-floor', color: '#808080', icon: '' });
    }
  }
}
