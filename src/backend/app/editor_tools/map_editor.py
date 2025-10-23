from abc import ABC, abstractmethod
from typing import List
from ..map_domain.map import Map
from ..map_domain.game_object import GameObject



# --- Observer Pattern ---
class MapObserver(ABC):
    @abstractmethod
    def on_map_changed(self, new_map: Map):
        pass

# --- Singleton Pattern ---
class MapEditor:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MapEditor, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        self.current_map: Map | None = None
        self.available_objects: List[GameObject] = []
        self._observers: List[MapObserver] = []

    def add_observer(self, observer: MapObserver):
        self._observers.append(observer)

    def remove_observer(self, observer: MapObserver):
        self._observers.remove(observer)

    def _notify_observers(self):
        for observer in self._observers:
            if self.current_map:
                observer.on_map_changed(self.current_map)

    # --- Factory Method ---
    def new_map(self, map_type: str, width: int, height: int):
        if map_type == 'empty':
            self.current_map = self._create_empty_map(width, height)
        elif map_type == 'random':
            self.current_map = self._create_random_map(width, height)
        self._notify_observers()

    def _create_empty_map(self, width: int, height: int) -> Map:
        return Map('New Map', width, height)

    def _create_random_map(self, width: int, height: int) -> Map:
        # Not implemented yet
        return Map('Random Map', width, height)

    def load_map(self, file_path: str):
        # Not implemented yet
        pass

    def save_map(self, file_path: str):
        # Not implemented yet
        pass

    def place_object(self, obj: GameObject, x: int, y: int):
        # The command pattern could be used here to support undo/redo functionality.
        if self.current_map:
            self.current_map.add_object(obj)
            obj.position = (x, y)
            self._notify_observers()

    def add_label(self, text: str, x: int, y: int):
        # Not implemented yet
        pass

    def calculate_statistics(self):
        # Not implemented yet
        pass

    def determine_difficulty(self):
        # Not implemented yet
        pass

# The MapBuilder class could be implemented using the builder pattern
class MapBuilder:
    def __init__(self, width: int, height: int):
        self.map = Map('Custom Map', width, height)

    def add_object(self, obj: GameObject, x: int, y: int):
        self.map.add_object(obj)
        obj.position = (x, y)

    def add_label(self, text: str, x: int, y: int):
        # Not implemented yet
        pass

    def get_map(self) -> Map:
        return self.map
