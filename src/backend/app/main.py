from flask import Flask, request, jsonify
from flask_cors import CORS
from app.db.db import db, DbLoad, AllDocumentsFetcher
from app.analysis.difficulty import Difficulty

app = Flask(__name__)
CORS(app)

maps_collection = db["maps"]

@app.route("/api/health", methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route("/api/maps", methods=['GET'])
def get_maps():
    try:
        print("API endpoint /api/maps hit. Fetching all maps...")
        fetcher = AllDocumentsFetcher()
        full_maps_data = fetcher.fetch_all()
        
        maps_summary = [
            {"name": doc.get("name"), "difficulty": doc.get("difficulty")}
            for doc in full_maps_data
        ]
        
        print(f"Found {len(maps_summary)} maps. Returning summary data.")
        return jsonify(maps_summary)
    except Exception as e:
        print(f"Error in /api/maps: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps/<string:map_name>", methods=['GET'])
def get_map_by_name(map_name):
    try:
        print(f"Fetching map by name: {map_name}")
        result = maps_collection.find_one({"name": map_name}, {"_id": 0})
        if result:
            print(f"Map found: {map_name}, cells count: {len(result.get('cells', []))}")
            return jsonify(result)
        else:
            print(f"Map not found: {map_name}")
            return jsonify({"error": "Map not found"}), 404
    except Exception as e:
        print(f"Error fetching map {map_name}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps", methods=['POST'])
def save_map():
    try:
        data = request.get_json()
        #print(f"Received data for save: {data.keys() if data else 'None'}")
        
        
        if not data or 'name' not in data:
            return jsonify({"error": "Invalid data format, must include name"}), 400

        name = data['name']
        
        
        if maps_collection.find_one({"name": name}):
            return jsonify({"error": "A map with this name already exists"}), 409

        map_document = {
            "name": name,
            "gridSize": data.get('gridSize', {"width": 30, "height": 20}),
            "zoom": data.get('zoom', 1),
            "cells": data.get('cells', []),
            "timestamp": data.get('timestamp'),
            "cellCount": data.get('cellCount', len(data.get('cells', []))),
            "difficulty": data.get('difficulty')
        }

        maps_collection.insert_one(map_document)
        #print(f"Map '{name}' saved successfully with {len(map_document.get('cells', []))} cells")
        return jsonify({"message": f"Map '{name}' saved successfully"}), 201
    except Exception as e:
        #print(f"Error saving map: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/maps/<string:map_name>", methods=['PUT'])
def update_map(map_name):
    try:
        data = request.get_json()
        print(f"Updating map '{map_name}' with data keys: {data.keys() if data else 'None'}")
        
        if not data:
            return jsonify({"error": "Invalid data format"}), 400

        update_data = {}
        
        if 'cells' in data:
            update_data['cells'] = data['cells']
            update_data['cellCount'] = len(data['cells'])
        
        if 'gridSize' in data:
            update_data['gridSize'] = data['gridSize']
        
        if 'zoom' in data:
            update_data['zoom'] = data['zoom']
        
        if 'difficulty' in data:
            update_data['difficulty'] = data['difficulty']
        
        if 'timestamp' in data:
            update_data['timestamp'] = data['timestamp']

        result = maps_collection.update_one(
            {"name": map_name},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            #print(f"Map '{map_name}' not found for update")
            return jsonify({"error": "Map not found"}), 404

        #print(f"Map '{map_name}' updated successfully")
        return jsonify({"message": f"Map '{map_name}' updated successfully"}), 200
    except Exception as e:
        #print(f"Error updating map: {e}")
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

if __name__ == "__main__":
    app.run(debug=True, port=8000)
