from .db_config import db
from .saver import RealDataSaver, EmptyDataSaver
from .db_handler_abst import DBHandlerAbstract



# --- Factory method pattern ---

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


        
class DocumentDeleter:
    def __init__(self):
        pass

    def delete_by_name(self, nev: str) -> bool:
        try:
            collection = db["maps"]
            eredmeny = collection.delete_many({"name": nev})  # Törlés név alapján
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
            dokumentumok = list(collection.find({}, {"_id": 0}))  # Minden dokumentum, _id nélkül
            return dokumentumok
        except Exception as e:
            print(f"Hiba a dokumentumok lekérése során: {e}")
            return []      