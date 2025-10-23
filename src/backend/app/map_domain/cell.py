from typing import Optional
from .game_object import GameObject

class Cell:
    def __init__(self, x: int, y: int, terrain_type: str = 'grass', obj: Optional[GameObject] = None):
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.object = obj
