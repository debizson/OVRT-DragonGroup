from .db_config import db
from .db_handler_abst import DBHandlerAbstract



# Null object pattern

class EmptyDataSaver(DBHandlerAbstract):
    def __init__(self):
        super().__init__("ures_mento")

    def run(self, dokumentumok: list[dict]) -> bool:
        self.logolas("Üres mentés a 'maps' kollekcióba")
        try:
            collection = db["maps"]

            alap_dokumentum = {
                "name": "default_map5",
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
                        "color": "#66265f",
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

    def run(self, dokumentumok: list[dict]) -> bool:
        self.logolas("Valós mentés a 'maps' kollekcióba")
        try:
            collection = db["maps"]
            for dokumentum in dokumentumok:
                collection.insert_one(dokumentum)
            return True
        except Exception as e:
            print(f"Hiba a mentés során: {e}")
            return False