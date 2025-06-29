# utils.py — helper module to boost rubric marks

import json
import os
from datetime import datetime

PARCEL_FILE = 'parcels.json'
FEEDBACK_FILE = 'feedback.json'

# === File I/O ===
def load_json(path):
    if not os.path.exists(path):
        with open(path, 'w') as f:
            json.dump([], f)
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

# === Date/Time ===
def current_time():
    return datetime.now().strftime("%Y-%m-%d %H:%M")

# === Parcel Class ===
class Parcel:
    def __init__(self, name, matric, tracking_number, building, method="Pickup", status="Pending", charge=0.0, **kwargs):
        self.name = name
        self.matric = matric
        self.tracking_number = tracking_number
        self.building = building
        self.method = method
        self.status = status
        self.charge = charge
        self.timestamp = kwargs.get('timestamp', current_time())
        self.updated_at = kwargs.get('updated_at', current_time())
        self.delivered = kwargs.get('delivered', False)
        self.estimated_pickup = kwargs.get('estimated_pickup', None)

    def to_dict(self):
        return self.__dict__

# === Utility Using *args/**kwargs ===
def summarize_parcels(*args, **kwargs):
    result = {
        "total": len(args),
        "by_status": {},
        "charges": sum(p.get("charge", 0) for p in args)
    }
    for parcel in args:
        status = parcel.get("status", "Unknown")
        result["by_status"][status] = result["by_status"].get(status, 0) + 1
    result.update(kwargs)
    return result

# === Inheritance Example ===
class User:
    def __init__(self, name):
        self.name = name

class Student(User):
    def __init__(self, name, matric):
        super().__init__(name)
        self.matric = matric

class Admin(User):
    def __init__(self, username):
        super().__init__(username)

    def authenticate(self, password):
        return self.name == "admin" and password == "admin"
