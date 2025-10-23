from flask import Flask
from .db import db

app = Flask(__name__)

@app.get("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True, port=8000)


    # main.py
# Ez a fájl a szöveges felhasználói felületet és a vezérlést tartalmazza

# from database.db_save import SaveMap
# from database.db_load import LoadMap
# from database.db_default import DefaultMap
# from logic.difficulty import DifficultyCalculator

# def main():
#     print("Üdvözöllek a D&D pályaszerkesztőben!")

#     while True:  # A ciklus
#         print("\nMit szeretnél tenni?")
#         print("l - Betöltés")
#         print("e - Új térkép szerkesztése")
#         print("o - Kilépés mentés nélkül")

#         choice = input("Választás: ").strip().lower()

#         if choice == "o":
#             print("Kilépés a programból. Viszlát!")
#             break

#         elif choice == "e":
#             items = []  # Elhelyezett dolgok listája

#             while True:  # AB ciklus
#                 print("\nMit szeretnél elhelyezni?")
#                 print("f - Bútor")
#                 print("m - Szörny")
#                 print("p - Játékos")
#                 print("s - Szerkesztés vége és mentés")
#                 print("c - Mégse (vissza a főmenübe)")

#                 sub_choice = input("Választás: ").strip().lower()

#                 if sub_choice == "c":
#                     print("Szerkesztés megszakítva. Visszatérés a főmenübe.")
#                     items.clear()
#                     break

#                 elif sub_choice == "s":
#                     if not items:
#                         print("Nincs semmi a térképen. Alapértelmezett mentés történik.")
#                         name = input("Add meg a mentés nevét: ").strip()
#                         default_map = DefaultMap()
#                         default_map.save_default(name)
#                     else:
#                         name = input("Add meg a mentés nevét: ").strip()
#                         difficulty = DifficultyCalculator.calculate(items)
#                         saver = SaveMap()
#                         saver.execute(name, items, difficulty)
#                     break

#                 elif sub_choice in ["f", "m", "p"]:
#                     type_map = {"f": "furniture", "m": "monster", "p": "player"}
#                     item_type = type_map[sub_choice]

#                     try:
#                         row = int(input("Melyik sorba rakjam? Add meg számmal: "))
#                         col = int(input("Melyik oszlopba? Add meg számmal: "))
#                         items.append({"type": item_type, "row": row, "col": col})
#                         print(f"{item_type} elhelyezve a ({row}, {col}) pozícióba.")
#                     except ValueError:
#                         print("Hibás bevitel! Csak számot adj meg. Próbáld újra.")

#                 else:
#                     print("Ismeretlen választás. Próbáld újra.")

#         elif choice == "l":
#             loader = LoadMap()
#             all_maps = list(loader.collection.find({}, {"name": 1, "_id": 0}))
#             if not all_maps:
#                 print("Nincs elmentett térkép az adatbázisban.")
#                 continue

#             print("\nElérhető térképek:")
#             for m in all_maps:
#                 print(f"- {m['name']}")

#             while True:
#                 map_name = input("Add meg a betöltendő térkép nevét (vagy nyomd meg a c gombot a visszalépéshez): ").strip()
#                 if map_name.lower() == "c":
#                     print("Visszatérés a főmenübe.")
#                     break

#                 result = loader.execute(map_name)
#                 if result:
#                     print(f"Térkép '{map_name}' betöltve. Szerkesztés indul.")
#                     items = result["items"]
#                     break
#                 else:
#                     print("Nincs ilyen nevű térkép az adatbázisban. Próbáld újra.")

#         else:
#             print("Ismeretlen választás. Próbáld újra.")

# if __name__ == "__main__":
#     main()
