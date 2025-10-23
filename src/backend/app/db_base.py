# Absztrakt osztály az adatbázis kapcsolathoz
# Factory method pattern
from abc import ABC, abstractmethod
from database.db import db  # Itt használjuk a db.py fájlt

class DatabaseOperation(ABC):
    def __init__(self):
        self.collection = db["maps"]  # A maps kollekciót használjuk

    @abstractmethod
    def execute(self, *args, **kwargs):
        pass
``