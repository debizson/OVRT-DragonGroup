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
        


       




# Null object pattern

class SaveController:
    def __init__(self):
        pass

   
    def dokumentum_ures(self, dokumentum: dict) -> bool:
        # Akkor tekintjük üresnek, ha nincs cella, vagy minden cella 'type' mezője üres (None, "", 0 vagy hiányzik)
        cells = dokumentum.get("cells", [])
        if not cells:
            return True  # nincs egyetlen cella sem
        return all(
            not cell.get("type") or cell.get("type") in [None, "", 0]
            for cell in cells
        )



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

    def run(self, kollekcio_nev: str, dokumentumok: list[dict]) -> bool:
        self.logolas(f"Valós mentés kollekcióba: {kollekcio_nev}")
        try:
            collection = db[kollekcio_nev]
            collection.insert_many(dokumentumok)
            return True
        except Exception as e:
            print(f"Hiba a mentés során: {e}")
            return False
        

class CollectionLister:
    def __init__(self):
        pass

       
    def list_collections(self) -> list[str]:
        try:
            collections = db.list_collection_names()
            return collections
        except Exception as e:
            print(f"Hiba a kollekciók listázása során: {e}")
            return []





#Példa használat:

# map nevek listázása, azaz a kollekcióké

# lister = CollectionLister()
# kollekciok = lister.list_collections()
# print("Kollekciók az adatbázisban:", kollekciok)




# document_list = {
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




# print(document_list)



# controller = SaveController()
# controller.run("map230", [document_list])

# loader = DbLoad()
# document_list = loader.run("map230")

# print(document_list)


