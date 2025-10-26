from pymongo import MongoClient
import os
from dotenv import load_dotenv
from abc import ABC, abstractmethod






load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB = os.getenv("MONGODB_DB", "dnd_dev")

client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

print(f"Connected to MongoDB database: {MONGODB_DB}")






# Feltételezzük, hogy a MongoDB kapcsolat már létrejött és a 'db' objektum elérhető

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

    def run(self, nev: str) -> list[dict]:
        self.logolas(f"Adatok lekérése a 'maps' kollekcióból a név alapján: {nev}")
        try:
            collection = db["maps"]
            dokumentum = list(collection.find({"name": nev}, {"_id": 0}))
            return dokumentum
        except Exception as e:
            print(f"Hiba a lekérés során: {e}")
            return []


# --- Null object pattern ---

class SaveController:
    def __init__(self):
        pass

    def dokumentum_ures(self, dokumentum: dict) -> bool:
        cells = dokumentum.get("cells", [])
        if not cells:
            return True
        return all(
            not cell.get("type") or cell.get("type") in [None, "", 0]
            for cell in cells
        )

    def run(self, dokumentumok: list[dict]) -> bool:
        if dokumentumok and not all(self.dokumentum_ures(d) for d in dokumentumok):
            mento = RealDataSaver()
        else:
            mento = EmptyDataSaver()

        return mento.run(dokumentumok)


class EmptyDataSaver(DBHandlerAbstract):
    def __init__(self):
        super().__init__("ures_mento")

    def run(self, dokumentumok: list[dict]) -> bool:
        self.logolas("Üres mentés a 'maps' kollekcióba")
        try:
            collection = db["maps"]

            alap_dokumentum = {
                "name": "default_map",  # ✅ HOZZÁADVA: alapértelmezett név mező
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
                collection.insert_one(dokumentum)  # ✅ MÓDOSÍTÁS: dokumentum mentése módosítás nélkül
            return True
        except Exception as e:
            print(f"Hiba a mentés során: {e}")
            return False


# --- Dokumentum listázó ---

class DocumentLister:
    def __init__(self):
        pass

    def list_documents(self) -> list[dict]:
        try:
            collection = db["maps"]
            dokumentumok = list(collection.find({}, {"_id": 0}))
            return dokumentumok
        except Exception as e:
            print(f"Hiba a dokumentumok listázása során: {e}")
            return []
        
class DocumentDeleter:
    def __init__(self):
        pass

    def delete_by_name(self, nev: str) -> bool:
        try:
            collection = db["maps"]
            eredmeny = collection.delete_many({"name": nev})  # 🔧 Törlés név alapján
            print(f"{eredmeny.deleted_count} dokumentum törölve a 'maps' kollekcióból.")
            return eredmeny.deleted_count > 0
        except Exception as e:
            print(f"Hiba a törlés során: {e}")
            return False  

class AllDocumentsFetcher:
    def __init__(self):
        pass

    def fetch_all(self) -> list[dict]:
        try:
            collection = db["maps"]
            dokumentumok = list(collection.find({}, {"_id": 0}))  # 🔍 Minden dokumentum, _id nélkül
            return dokumentumok
        except Exception as e:
            print(f"Hiba a dokumentumok lekérése során: {e}")
            return []      


#Példa használat:




# document = {
#      "name": "default_map4",  # ✅ HOZZÁADVA: alapértelmezett név mező
#      "gridSize": {
#          "width": 30,
#          "height": 20
#      },
#      "zoom": 1,
#      "cells": [
#          {
#              "x": 3,
#              "y": 5,
#              "type": "door",
#              "color": "#66265f",
#              "icon": ""
#          },
     
#          {
#              "x": 3,
#              "y": 4,
#              "type": "wall",
#              "color": "#66265f",
#              "icon": ""
#          }
#      ],
#      "timestamp": "2025-10-25T13:25:51.522Z",
#      "cellCount": 1
#  }




# print(document)



# controller = SaveController()
# controller.run([document])

# loader = DbLoad()
# document= loader.run("default_map")

# print(document)

# deleter = DocumentDeleter()
# deleter.delete_by_name("default_map")

# fetcher = AllDocumentsFetcher()
# osszes = fetcher.fetch_all()
# for doc in osszes:
#     print(doc)



