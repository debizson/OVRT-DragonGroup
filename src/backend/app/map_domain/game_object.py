from abc import ABC, abstractmethod

class GameObject(ABC):
    def __init__(self, name: str, symbol: str, x: int, y: int, object_type: str):
        self.name = name
        self.symbol = symbol
        self.position = (x, y)
        self.type = object_type

    @abstractmethod
    def draw(self):
        pass

class Monster(GameObject):
    def __init__(self, name: str, symbol: str, x: int, y: int, level: int, species: str):
        super().__init__(name, symbol, x, y, 'monster')
        self.level = level
        self.species = species

    def draw(self):
        # Not implemented yet
        pass

class Character(GameObject):
    def __init__(self, name: str, symbol: str, x: int, y: int, hp: int):
        super().__init__(name, symbol, x, y, 'character')
        self.hp = hp

    def draw(self):
        # Not implemented yet
        pass

class Furniture(GameObject):
    def __init__(self, name: str, symbol: str, x: int, y: int, width: int, height: int, material: str):
        super().__init__(name, symbol, x, y, 'furniture')
        self.size = (width, height)
        self.material = material

    def draw(self):
        # Not implemented yet
        pass
