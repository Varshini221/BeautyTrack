from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from dotenv import load_dotenv
import os
import requests

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = Flask(__name__)

CORS(app, origins="*")

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

#creates the table if it doesnt exist
def init_db():
    db = get_db()
    db.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(30) NOT NULL,
        category VARCHAR(30) NOT NULL, 
        time TIME NOT NULL,
        cost DECIMAL(3, 2) DEFAULT 0, 
        date DATE NOT NULL
        )        
    """)
    db.commit()

init_db()


@app.route("/appointments", methods = ["POST"])
def add_appointments():
    data = request.json
    db = get_db()
    db.execute(
        "INSERT INTO appointments(name, category, time, cost, date) VALUES(?, ?, ?, ?, ?)",
        (data["name"], data["category"], data["time"], data["cost"], data["date"])
    )
    db.commit()
    return jsonify({"ok": True}), 201


@app.route("/appointments", methods = ["GET"])
def get_appointments():
    db = get_db()
    appointments = db.execute(
        "SELECT * FROM appointments ORDER by date, time"
    ).fetchall()
    return jsonify([dict(appointment) for appointment in appointments])

@app.route("/appointments/<int:id>", methods = ["DELETE"])
def delete_appointment(id):
    db = get_db()
    db.execute("DELETE FROM appointments where id = ?", (id,))
    db.commit()
    return jsonify({"ok": True}), 200

@app.route("/nearby", methods = ["GET"])
def nearby():
    service = request.args.get('service')
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    radius = request.args.get('radius')

    url = "https://places.googleapis.com/v1/places:searchNearby"    
    headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating"
        }
    body = {
        "includedTypes": [service],
        "maxResultCount": 10,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": float(lat),
                    "longitude": float(lng)
                },
                "radius": float(radius) * 1000
            }
        }
    }

 
    res = requests.post(url, headers=headers, json = body)
    
    data = res.json()

    places = []
    for place in data.get("places", []):
        places.append({
            "name": place["displayName"]["text"],
            "address": place.get("formattedAddress", ""),
            "rating": place.get("rating", "No rating")

        })
    return jsonify(places)


if __name__ == "__main__":
    app.run(debug=True, port=5001)