interface CellData {
  type: string;
  color: string;
  icon: string;
}

export type DifficultyLevel = 'Könnyű' | 'Közepes' | 'Nehéz' | 'Nagyon nehéz';

export interface DifficultyInfo {
  level: DifficultyLevel;
  score: number;
  color: string;
}

export function calculateDifficulty(cells: Map<string, CellData>, gridSize: { width: number; height: number }): DifficultyInfo {
  let score = 0;

  const monsterCount = Array.from(cells.values()).filter(cell => cell.type === 'monster').length;
  const doorCount = Array.from(cells.values()).filter(cell => cell.type === 'door').length;
  const wallCount = Array.from(cells.values()).filter(cell => 
    cell.type === 'wall' || cell.type === 'stone-wall' || cell.type === 'wood-wall'
  ).length;
  const furnitureCount = Array.from(cells.values()).filter(cell => 
    cell.type === 'table' || cell.type === 'chair' || cell.type === 'bed' || cell.type === 'chest'
  ).length;

  score += monsterCount * 15;
  
  score += doorCount * 2;
  
  const mapArea = gridSize.width * gridSize.height;
  const wallDensity = wallCount / mapArea;
  score += wallDensity * 50;
  
  score += furnitureCount * 1;
  
  const filledCells = cells.size;
  const complexity = filledCells / mapArea;
  score += complexity * 30;

  let level: DifficultyLevel;
  let color: string;

  if (score < 20) {
    level = 'Könnyű';
    color = 'text-green-600';
  } else if (score < 50) {
    level = 'Közepes';
    color = 'text-yellow-600';
  } else if (score < 80) {
    level = 'Nehéz';
    color = 'text-orange-600';
  } else {
    level = 'Nagyon nehéz';
    color = 'text-red-600';
  }

  return { level, score: Math.round(score), color };
}
