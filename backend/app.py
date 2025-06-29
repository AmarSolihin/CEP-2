# app.py — updated with utils.py and Parcel class

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from utils import load_json, save_json, current_time, Parcel, summarize_parcels, Student, Admin
import csv
import tempfile
import os

app = Flask(__name__)
CORS(app)

PARCEL_FILE = 'parcels.json'
FEEDBACK_FILE = 'feedback.json'

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    name = data.get("name", "").strip()
    matric = data.get("matric", "").strip()
    if not name or not matric:
        return jsonify({"error": "Name and Matric required"}), 400
    user = Student(name, matric)
    return jsonify({"message": "Login successful", "name": user.name, "matric": user.matric}), 200

@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    admin = Admin(data.get("username"))
    if admin.authenticate(data.get("password")):
        return jsonify({"message": "Admin login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/parcels", methods=["GET"])
def get_all_parcels():
    return jsonify(load_json(PARCEL_FILE))

@app.route("/parcels/user/<matric>", methods=["GET"])
def get_user_parcels(matric):
    parcels = load_json(PARCEL_FILE)
    user_parcels = [p for p in parcels if p['matric'] == matric]
    return jsonify(user_parcels)

@app.route("/parcels/search", methods=["POST"])
def search_parcel():
    data = request.json
    tracking = data.get("tracking")
    matric = data.get("matric")
    parcels = load_json(PARCEL_FILE)
    for p in parcels:
        if p["tracking_number"] == tracking and p["matric"] == matric:
            return jsonify(p)
    return jsonify({"error": "Parcel not found"}), 404

@app.route("/parcels/add", methods=["POST"])
def add_parcel():
    parcels = load_json(PARCEL_FILE)
    data = request.json
    parcel = Parcel(**data)
    parcels.append(parcel.to_dict())
    save_json(PARCEL_FILE, parcels)
    return jsonify({"message": "Parcel added"}), 201

@app.route("/parcels/update-method", methods=["POST"])
def update_method():
    parcels = load_json(PARCEL_FILE)
    data = request.json
    tracking = data["tracking_number"]
    matric = data["matric"]
    for p in parcels:
        if p["tracking_number"] == tracking and p["matric"] == matric:
            if p["status"] == "Pending":
                if data.get("method") == "Delivery":
                    p["status"] = "Delivered"
                    p["method"] = "Delivery"
                    p["charge"] = 1.00
                    p["estimated_pickup"] = None
                else:
                    p["status"] = "Pickup Ready"
                    p["method"] = "Pickup"
                    p["charge"] = 0.0
                    from datetime import datetime, timedelta
                    p["estimated_pickup"] = (datetime.now() + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M")
                p["updated_at"] = current_time()
                p["delivered"] = True
                save_json(PARCEL_FILE, parcels)
                return jsonify(p), 200
            else:
                return jsonify({"error": "Already updated"}), 400
    return jsonify({"error": "Parcel not found"}), 404

@app.route("/parcels/pickup", methods=["POST"])
def mark_as_picked_up():
    data = request.json
    parcels = load_json(PARCEL_FILE)
    for p in parcels:
        if p["tracking_number"] == data["tracking_number"] and p["status"] == "Pickup Ready":
            p["status"] = "Picked Up"
            p["updated_at"] = current_time()
            save_json(PARCEL_FILE, parcels)
            return jsonify({"message": "Parcel marked as Picked Up"})
    return jsonify({"error": "Parcel not eligible"}), 400

@app.route("/parcels/summary/<matric>", methods=["GET"])
def profile_summary(matric):
    parcels = load_json(PARCEL_FILE)
    user_parcels = [p for p in parcels if p['matric'] == matric]
    return jsonify(summarize_parcels(*user_parcels, user=matric))

@app.route("/feedback", methods=["POST"])
def submit_feedback():
    feedbacks = load_json(FEEDBACK_FILE)
    data = request.json
    data["timestamp"] = current_time()
    feedbacks.append(data)
    save_json(FEEDBACK_FILE, feedbacks)
    return jsonify({"message": "Feedback submitted"}), 201

@app.route("/feedback", methods=["GET"])
def get_feedbacks():
    return jsonify(load_json(FEEDBACK_FILE))

@app.route("/parcels/export", methods=["GET"])
def export_parcels():
    parcels = load_json(PARCEL_FILE)

    temp_dir = tempfile.gettempdir()
    filename = os.path.join(temp_dir, "parcel_export.csv")

    headers = (
        "Tracking Number", "Name", "Matric", "Building",
        "Method", "Status", "Charge", "Timestamp", "Updated At"
    )

    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for p in parcels:
            writer.writerow([
                p["tracking_number"], p["name"], p["matric"], p["building"], p["method"],
                p.get("status", "Pending"), f"{p.get('charge', 0.0):.2f}",
                p.get("timestamp", ""), p.get("updated_at", "")
            ])

    return send_file(filename, as_attachment=True)

@app.route("/parcels/clear", methods=["POST"])
def clear_parcels():
    save_json(PARCEL_FILE, [])
    return jsonify({"message": "All parcels cleared."})

if __name__ == "__main__":
    app.run(debug=True)
