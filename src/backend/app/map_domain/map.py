from typing import List
from .cell import Cell
from .label import Label
from .game_object import GameObject

class Map:
    def __init__(self, name: str, width: int, height: int):
        self.name = name
        self.grid: List[List[Cell]] = [[Cell(x, y) for y in range(height)] for x in range(width)]
        self.labels: List[Label] = []
        self.objects: List[GameObject] = []

    def get_cell(self, x: int, y: int) -> Cell:
        return self.grid[x][y]

    def add_object(self, obj: GameObject):
        self.objects.append(obj)

    def remove_object(self, obj: GameObject):
        self.objects.remove(obj)

    def get_rooms(self) -> List:
        # Not implemented yet
        return []
