
# Mentés osztály
from .db_base import DatabaseOperation
class SaveMap(DatabaseOperation):
    def execute(self, name, items, difficulty):
        data = {
            "name": name,
            "difficulty": difficulty,
            "items": items
        }
        self.collection.insert_one(data)
        print(f"A(z) '{name}' nevű térkép sikeresen elmentve.")
