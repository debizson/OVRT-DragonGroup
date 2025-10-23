# Betöltés osztály
from .db_base import DatabaseOperation
class LoadMap(DatabaseOperation):
    def execute(self, name):
        result = self.collection.find_one({"name": name})
        return result
