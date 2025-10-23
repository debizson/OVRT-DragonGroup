
# Null Object osztály - alapértelmezett mentés
from .db_save import SaveMap

class DefaultMap:
    def __init__(self):
        self.saver = SaveMap()

    def save_default(self, name):
        default_items = [{"type": "furniture", "row": 1, "col": 1}]
        self.saver.execute(name, default_items, "easy")
