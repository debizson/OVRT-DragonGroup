from abc import ABC, abstractmethod
from typing import List
#from ..map_domain.map import Map
#from ..map_domain.game_object import GameObject
from src.backend.app.db import db



# --- Observer Pattern ---
class MapObserver(ABC):
    @abstractmethod
    def on_map_changed(self, new_map: Map):
        pass




# --- Factory method pattern ---
    
class DBHandlerAbstract(ABC):
    def __init__(self, forras_nev: str):
        self.forras_nev = forras_nev

    def logolas(self, muvelet: str):
        print(f"{muvelet} művelet a(z) {self.forras_nev} forráson.")

    @abstractmethod
    def run(self, *args, **kwargs):
        pass




class DbLoad(DBHandlerAbstract):
    def __init__(self):
        super().__init__("loader")

    def run(self, kollekcio_nev: str, szuro: dict = {}) -> list[dict]:
        self.logolas(f"Adatok lekérése a kollekcióból: {kollekcio_nev}")
        try:
            collection = db[kollekcio_nev]
            dokumentumok = list(collection.find(szuro))
            return dokumentumok
        except Exception as e:
            print(f"Hiba a lekérés során: {e}")
            return []




# egy olyan verzió, amikor a kollekció neveit akarom csoportisítani
#  egy alap kolleció gyűjtő névvel, és így menteni a spec. névvel
#  hozzá konkatenálva

# class AdatMento(DBtHandlerAbstract):
#     def __init__(self, alap_kollekcio_nev: str):
#         super().__init__(alap_kollekcio_nev)
#         self.alap_kollekcio_nev = alap_kollekcio_nev

#     def run(self, nev: str, dokumentumok: list[dict]) -> bool:
#         uj_kollekcio_nev = f"{self.alap_kollekcio_nev}_{nev}"
#         self.logolas(f"Mentés kollekcióba: {uj_kollekcio_nev}")
#         try:
#             collection = db[uj_kollekcio_nev]
#             if dokumentumok:
#                 collection.insert_many(dokumentumok)
#                 return True
#             else:
#                 print("Üres dokumentumlista.")
#                 return False
#         except Exception as e:
#             print(f"Hiba a mentés során: {e}")
#             return False



        




# Null object pattern

class SaveController:
    def __init__(self):
        pass

    def dokumentum_ures(self, d: dict) -> bool:
        # Akkor tekintjük üresnek, ha minden érték None, üres string, vagy False
        return all(not d.get(k) for k in d)

    def run(self, kollekcio_nev: str, dokumentumok: list[dict]) -> bool:
        if dokumentumok and not all(self.dokumentum_ures(d) for d in dokumentumok):
            mento = RealDataSaver()
        else:
            mento = EmptyDataSaver()

        return mento.run(kollekcio_nev, dokumentumok)
    


class EmptyDataSaver(DBHandlerAbstract):
    def __init__(self):
        super().__init__("ures_mento")

    def run(self, kollekcio_nev: str, dokumentumok: list[dict]) -> bool:
        self.logolas(f"Üres mentés kollekcióba: {kollekcio_nev}")
        try:
            collection = db[kollekcio_nev]
           
            alap_dokumentum = {
                "gridSize": {
                    "width": 30,
                    "height": 20
                },
                "zoom": 1,
                "cells": [
                    {
                        "x": 1,
                        "y": 1,
                        "type": "wall",
                        "color": "#6b7280",
                        "icon": ""
                    }
                ],
                "timestamp": "2025-10-25T13:25:51.522Z",
                "cellCount": 1
            }

            collection.insert_one(alap_dokumentum)
            return True
        except Exception as e:
            print(f"Hiba az alapértelmezett mentés során: {e}")
            return False


class RealDataSaver(DBHandlerAbstract):
    def __init__(self):
        super().__init__("valos_mento")

    def run(self, kollekcio_nev: str, dokumentumok: list[dict]) -> bool:
        self.logolas(f"Valós mentés kollekcióba: {kollekcio_nev}")
        try:
            collection = db[kollekcio_nev]
            collection.insert_many(dokumentumok)
            return True
        except Exception as e:
            print(f"Hiba a mentés során: {e}")
            return False



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
