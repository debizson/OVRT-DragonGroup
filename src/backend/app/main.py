from flask import Flask, request, jsonify
from flask_cors import CORS
from app.db.db import db
from app.analysis.difficulty import DifficultyCalculator

app = Flask(__name__)
CORS(app)

maps_collection = db["maps"]

@app.route("/api/health", methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/maps", methods=['GET'])
def get_maps():
    try:
        maps_data = list(maps_collection.find({}, {"_id": 0, "name": 1, "difficulty": 1}))
        print(f"Found {len(maps_data)} maps. Returning data.")
        return jsonify(maps_data)
    except Exception as e:
        print(f"Error in /api/maps: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps/<string:map_name>", methods=['GET'])
def get_map_by_name(map_name):
    try:
        result = maps_collection.find_one({"name": map_name}, {"_id": 0})
        if result:
            return jsonify(result)
        else:
            return jsonify({"error": "Map not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps", methods=['POST'])
def save_map():
    try:
        data = request.get_json()
        if not data or 'name' not in data or 'items' not in data or 'difficulty' not in data:
            return jsonify({"error": "Invalid data format, must include name, items, and difficulty"}), 400

        name = data['name']
        items = data['items']
        difficulty = data['difficulty']

        if maps_collection.find_one({"name": name}):
            return jsonify({"error": "A map with this name already exists"}), 409

        map_document = {
            "name": name,
            "items": items,
            "difficulty": difficulty
        }

        maps_collection.insert_one(map_document)
        return jsonify({"message": f"Map '{name}' saved successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps/<string:map_name>", methods=['PUT'])
def update_map(map_name):
    try:
        data = request.get_json()
        if not data or 'items' not in data or 'difficulty' not in data:
            return jsonify({"error": "Invalid data format, must include items and difficulty"}), 400

        items = data['items']
        difficulty = data['difficulty']

        result = maps_collection.update_one(
            {"name": map_name},
            {"$set": {"items": items, "difficulty": difficulty}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Map not found"}), 404

        return jsonify({"message": f"Map '{map_name}' updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps/<string:map_name>", methods=['DELETE'])
def delete_map(map_name):
    try:
        result = maps_collection.delete_one({"name": map_name})
        if result.deleted_count == 0:
            return jsonify({"error": "Map not found"}), 404
        
        return jsonify({"message": f"Map '{map_name}' deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/stats", methods=['GET'])
def get_stats():
    try:
        total_maps = maps_collection.count_documents({})
        
        pipeline = [
            {
                "$group": {
                    "_id": "$difficulty",
                    "count": {"$sum": 1}
                }
            }
        ]
        difficulty_results = list(maps_collection.aggregate(pipeline))
        
        difficulty_counts = {item['_id']: item['count'] for item in difficulty_results}

        # Ensure all difficulty levels are present in the response
        for key in ["EASY", "MEDIUM", "HARD", "VERY_HARD"]:
            if key not in difficulty_counts:
                difficulty_counts[key] = 0

        stats = {
            "total_maps": total_maps,
            "difficulty_counts": difficulty_counts
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

if __name__ == "__main__":
    app.run(debug=True, port=8000)