import { useRef, useEffect, useState } from 'react';
import TextDialog from './TextDialog';

// Import textures
import wallTexture from '../assets/dungeon/wall/stone_brick_1.png';
import stoneWallTexture from '../assets/dungeon/wall/stone_gray_0.png';
import woodWallTexture from '../assets/wood wall 1.png';
import floorTexture from '../assets/grass1.png';
import stoneFloorTexture from '../assets/dungeon/floor/grey_dirt_0_new.png';
import woodFloorTexture from '../assets/wood floor 1.png';
import doorTexture from '../assets/dungeon/doors/closed_door.png';
import waterTexture from '../assets/dungeon/water/deep_water.png';
import dirtTexture from '../assets/dirt 1.png';
import windowTexture from '../assets/window.png';
import stairsTexture from '../assets/dungeon/gateways/stone_stairs_up.png';
import chestTexture from '../assets/dungeon/chest.png';
import torchTexture from '../assets/dungeon/wall/torches/torch_1.png';
import treeTexture from '../assets/dungeon/trees/tree_1_yellow.png';
import monsterTexture from '../assets/monster/orc_warrior_new.png';
import characterTexture from '../assets/player/base/human_male.png';

interface CellData {
  type: string;
  color: string;
  icon: string;
}

interface GridCanvasProps {
  gridSize: { width: number; height: number };
  zoom: number;
  selectedTool: string;
  cells: Map<string, CellData>;
  setCells: (cells: Map<string, CellData>) => void;
}

export default function GridCanvas({ gridSize, zoom, selectedTool, cells, setCells }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = 32;
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const texturesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  useEffect(() => {
    const texturesToLoad: Record<string, string> = {
      'wall': wallTexture,
      'stone-wall': stoneWallTexture,
      'wood-wall': woodWallTexture,
      'floor': floorTexture,
      'stone-floor': stoneFloorTexture,
      'wood-floor': woodFloorTexture,
      'door': doorTexture,
      'water': waterTexture,
      'dirt': dirtTexture,
      'window': windowTexture,
      'stairs': stairsTexture,
      'chest': chestTexture,
      'torch': torchTexture,
      'tree': treeTexture,
      'monster': monsterTexture,
      'character': characterTexture
    };

    let loadedCount = 0;
    const totalTextures = Object.keys(texturesToLoad).length;

    Object.entries(texturesToLoad).forEach(([key, url]) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Successfully loaded texture: ${key}`);
        texturesRef.current.set(key, img);
        loadedCount++;
        if (loadedCount === totalTextures) {
          console.log('All textures loaded!');
          setTexturesLoaded(true);
        }
      };
      img.onerror = (error) => {
        console.error(`Failed to load texture: ${key} from ${url}`, error);
        loadedCount++;
        if (loadedCount === totalTextures) {
          setTexturesLoaded(true);
        }
      };
      img.src = url;
    });
  }, []);

  const drawTexture = (ctx: CanvasRenderingContext2D, type: string, x: number, y: number, size: number) => {
    const texture = texturesRef.current.get(type);
    
    if (texture && texture.complete && texture.naturalWidth > 0) {
      ctx.drawImage(texture, x, y, size, size);
      return;
    }
    
    // If texture failed to load, log it and use fallback
    if (!texture) {
      console.warn(`No texture found in map for type: ${type}, available textures:`, Array.from(texturesRef.current.keys()));
    } else {
      console.warn(`Texture exists but not ready for type: ${type}, complete: ${texture.complete}, naturalWidth: ${texture.naturalWidth}`);
    }

    switch (type) {
      case 'wall':
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, '#4a4a3a');
        gradient.addColorStop(0.5, '#5a5a4a');
        gradient.addColorStop(1, '#3a3a2a');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, size, size);
        
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            const brickX = x + (i * size / 2) + (j % 2) * (size / 4);
            const brickY = y + (j * size / 2);
            ctx.strokeStyle = '#2a2a1a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(brickX, brickY, size / 2, size / 2);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(brickX + 2, brickY + 2, 3, 3);
          }
        }
        break;

      case 'stone-wall':
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 8; i++) {
          const stoneX = x + Math.random() * size;
          const stoneY = y + Math.random() * size;
          ctx.fillStyle = `rgba(${70 + Math.random() * 30}, ${70 + Math.random() * 30}, ${70 + Math.random() * 30}, 0.6)`;
          ctx.beginPath();
          ctx.arc(stoneX, stoneY, 2 + Math.random() * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'wood-wall':
        const woodGrad = ctx.createLinearGradient(x, y, x, y + size);
        woodGrad.addColorStop(0, '#8b6914');
        woodGrad.addColorStop(0.5, '#654321');
        woodGrad.addColorStop(1, '#8b6914');
        ctx.fillStyle = woodGrad;
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = 'rgba(101, 67, 33, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, y + (i * size / 5));
          ctx.lineTo(x + size, y + (i * size / 5));
          ctx.stroke();
        }
        break;
        
      case 'floor':
        const grassBase = ctx.createRadialGradient(x + size/2, y + size/2, 0, x + size/2, y + size/2, size);
        grassBase.addColorStop(0, '#6b8e4e');
        grassBase.addColorStop(0.5, '#5a7d3d');
        grassBase.addColorStop(1, '#4a6d2d');
        ctx.fillStyle = grassBase;
        ctx.fillRect(x, y, size, size);
        
        for (let i = 0; i < 15; i++) {
          const grassX = x + Math.random() * size;
          const grassY = y + Math.random() * size;
          ctx.strokeStyle = `rgba(70, 100, 50, ${0.3 + Math.random() * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(grassX, grassY);
          ctx.lineTo(grassX + Math.random() * 3 - 1.5, grassY - 3 - Math.random() * 3);
          ctx.stroke();
        }
        
        for (let i = 0; i < 5; i++) {
          const dotX = x + Math.random() * size;
          const dotY = y + Math.random() * size;
          ctx.fillStyle = `rgba(139, 69, 19, ${0.3 + Math.random() * 0.3})`;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1 + Math.random(), 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'stone-floor':
        ctx.fillStyle = '#808080';
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            ctx.strokeStyle = '#606060';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + (i * size / 2), y + (j * size / 2), size / 2, size / 2);
          }
        }
        break;

      case 'wood-floor':
        const woodFloor = ctx.createLinearGradient(x, y, x + size, y);
        woodFloor.addColorStop(0, '#d2691e');
        woodFloor.addColorStop(0.5, '#cd853f');
        woodFloor.addColorStop(1, '#d2691e');
        ctx.fillStyle = woodFloor;
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x + (i * size / 6), y);
          ctx.lineTo(x + (i * size / 6), y + size);
          ctx.stroke();
        }
        break;

      case 'dirt':
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 20; i++) {
          const dirtX = x + Math.random() * size;
          const dirtY = y + Math.random() * size;
          ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${70 + Math.random() * 30}, ${50 + Math.random() * 20}, 0.5)`;
          ctx.fillRect(dirtX, dirtY, 1 + Math.random(), 1 + Math.random());
        }
        break;

      case 'water':
        const waterGrad = ctx.createRadialGradient(x + size/2, y + size/2, 0, x + size/2, y + size/2, size);
        waterGrad.addColorStop(0, '#4a90e2');
        waterGrad.addColorStop(0.5, '#357abd');
        waterGrad.addColorStop(1, '#2a5f8f');
        ctx.fillStyle = waterGrad;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(x + size * 0.3 + i * 5, y + size * 0.5, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      case 'door':
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(x, y, size, size);
        
        const woodGrain = ctx.createLinearGradient(x, y, x, y + size);
        woodGrain.addColorStop(0, 'rgba(139, 105, 20, 0.3)');
        woodGrain.addColorStop(0.5, 'rgba(160, 120, 30, 0.2)');
        woodGrain.addColorStop(1, 'rgba(139, 105, 20, 0.3)');
        ctx.fillStyle = woodGrain;
        ctx.fillRect(x, y, size, size);
        
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = 'rgba(101, 67, 33, 0.4)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y + (i * size / 6));
          ctx.lineTo(x + size, y + (i * size / 6) + Math.random() * 3 - 1.5);
          ctx.stroke();
        }
        
        ctx.strokeStyle = '#4a3410';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8);
        
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        ctx.arc(x + size * 0.75, y + size * 0.5, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8b7500';
        ctx.lineWidth = 1;
        ctx.stroke();
        break;

      case 'window':
        ctx.fillStyle = '#8b6914';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
        ctx.strokeStyle = '#4a3410';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y + size * 0.2);
        ctx.lineTo(x + size * 0.5, y + size * 0.8);
        ctx.moveTo(x + size * 0.2, y + size * 0.5);
        ctx.lineTo(x + size * 0.8, y + size * 0.5);
        ctx.stroke();
        break;

      case 'stairs':
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(x, y, size, size);
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(139, 115, 85, ${0.5 + i * 0.1})`;
          ctx.fillRect(x, y + (i * size / 5), size, size / 5);
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y + (i * size / 5), size, size / 5);
        }
        break;
        
      default:
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(x, y, size, size);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaledCellSize = cellSize * zoom;
    canvas.width = gridSize.width * scaledCellSize;
    canvas.height = gridSize.height * scaledCellSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!texturesLoaded) {
      ctx.fillStyle = '#666';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Textúrák betöltése...', canvas.width / 2, canvas.height / 2);
      return;
    }

    cells.forEach((cellData, key) => {
      const [x, y] = key.split(',').map(Number);
      
      const texturedTypes = ['wall', 'floor', 'door', 'stone-wall', 'wood-wall', 'stone-floor', 'wood-floor', 'dirt', 'water', 'window', 'stairs', 'chest', 'torch', 'tree', 'monster', 'character'];
      const hasTexture = texturedTypes.includes(cellData.type);
      
      if (hasTexture) {
        drawTexture(ctx, cellData.type, x * scaledCellSize, y * scaledCellSize, scaledCellSize);
      } else if (cellData.type === 'text') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(
          x * scaledCellSize,
          y * scaledCellSize,
          scaledCellSize,
          scaledCellSize
        );
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x * scaledCellSize,
          y * scaledCellSize,
          scaledCellSize,
          scaledCellSize
        );
      } else {
        ctx.fillStyle = cellData.color;
        ctx.fillRect(
          x * scaledCellSize,
          y * scaledCellSize,
          scaledCellSize,
          scaledCellSize
        );
      }

      // Only render icon if it's text or if it doesn't have a texture
      if (cellData.icon && !hasTexture) {
        if (cellData.type === 'text') {
          ctx.font = `bold ${Math.min(scaledCellSize * 0.35, 14)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#000000';
          ctx.fillText(
            cellData.icon,
            x * scaledCellSize + scaledCellSize / 2,
            y * scaledCellSize + scaledCellSize / 2
          );
        } else {
          ctx.font = `${scaledCellSize * 0.6}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            cellData.icon,
            x * scaledCellSize + scaledCellSize / 2,
            y * scaledCellSize + scaledCellSize / 2
          );
        }
      }
    });

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let x = 0; x <= gridSize.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * scaledCellSize, 0);
      ctx.lineTo(x * scaledCellSize, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= gridSize.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * scaledCellSize);
      ctx.lineTo(canvas.width, y * scaledCellSize);
      ctx.stroke();
    }
  }, [gridSize, zoom, cells, cellSize, texturesLoaded]);

  const handleTextConfirm = (text: string) => {
    if (!textPosition) return;
    
    const key = `${textPosition.x},${textPosition.y}`;
    const newCells = new Map(cells);
    newCells.set(key, { type: 'text', color: '#ffffff', icon: text });
    setCells(newCells);
    setTextPosition(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaledCellSize = cellSize * zoom;
    const x = Math.floor((e.clientX - rect.left) / scaledCellSize);
    const y = Math.floor((e.clientY - rect.top) / scaledCellSize);

    if (x < 0 || x >= gridSize.width || y < 0 || y >= gridSize.height) return;

    const key = `${x},${y}`;
    const newCells = new Map(cells);

    switch (selectedTool) {
      case 'wall':
        newCells.set(key, { type: 'wall', color: '#6b7280', icon: '' });
        break;
      case 'stone-wall':
        newCells.set(key, { type: 'stone-wall', color: '#5a5a5a', icon: '' });
        break;
      case 'wood-wall':
        newCells.set(key, { type: 'wood-wall', color: '#8b6914', icon: '' });
        break;
      case 'door':
        newCells.set(key, { type: 'door', color: '#92400e', icon: '' });
        break;
      case 'window':
        newCells.set(key, { type: 'window', color: '#87ceeb', icon: '' });
        break;
      case 'stairs':
        newCells.set(key, { type: 'stairs', color: '#8b7355', icon: '' });
        break;
      case 'floor':
        newCells.set(key, { type: 'floor', color: '#f3f4f6', icon: '' });
        break;
      case 'stone-floor':
        newCells.set(key, { type: 'stone-floor', color: '#808080', icon: '' });
        break;
      case 'wood-floor':
        newCells.set(key, { type: 'wood-floor', color: '#d2691e', icon: '' });
        break;
      case 'dirt':
        newCells.set(key, { type: 'dirt', color: '#8b7355', icon: '' });
        break;
      case 'water':
        newCells.set(key, { type: 'water', color: '#4a90e2', icon: '' });
        break;
      case 'table':
        newCells.set(key, { type: 'table', color: '#fef3c7', icon: '🍽' });
        break;
      case 'chair':
        newCells.set(key, { type: 'chair', color: '#fef3c7', icon: '🪑' });
        break;
      case 'bed':
        newCells.set(key, { type: 'bed', color: '#fef3c7', icon: '🛏️' });
        break;
      case 'chest':
        newCells.set(key, { type: 'chest', color: '#fef3c7', icon: '📦' });
        break;
      case 'torch':
        newCells.set(key, { type: 'torch', color: '#fff3cd', icon: '🔥' });
        break;
      case 'tree':
        newCells.set(key, { type: 'tree', color: '#e8f5e9', icon: '🌲' });
        break;
      case 'character':
        newCells.set(key, { type: 'character', color: '#dbeafe', icon: '🧙' });
        break;
      case 'monster':
        newCells.set(key, { type: 'monster', color: '#fee2e2', icon: '👹' });
        break;
      case 'text':
        setTextPosition({ x, y });
        setShowTextDialog(true);
        return;
      case 'erase':
        newCells.delete(key);
        break;
      default:
        break;
    }

    setCells(newCells);
  };

  return (
    <>
      <div className="inline-block bg-white rounded-lg shadow-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-crosshair"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
      
      <TextDialog
        isOpen={showTextDialog}
        onClose={() => setShowTextDialog(false)}
        onConfirm={handleTextConfirm}
      />
    </>
  );
}
