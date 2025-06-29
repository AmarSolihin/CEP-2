# 📦 Student Parcel Management System

A Python-based parcel tracking system for university students and admins, built with Flask and JSON for local data handling. The project supports full backend + frontend features with a clean UI and responsive design.

---

## 🚀 Features

### 👤 User Side

* Login using name and matric number
* View parcel history (with status & charge)
* Track individual parcels by tracking number
* Change delivery method if status is pending
* Receive status updates and estimated pickup time
* Submit feedback/rating
* View profile summary (total parcels, charges, status breakdown)

### 🛠️ Admin Side

* Login using username/password
* Add new parcels with tracking info
* View all parcels with filtering
* Mark parcels as picked up
* Export parcel data to CSV
* View and manage feedback
* Clear all parcel records

---

## 💻 Technologies Used

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python + Flask
* **Database:** Local JSON files (no external DB)
* **Visualization:** Responsive UI with dark mode, toast notifications

---

## 🗂️ Project Structure

```
Assignment/
├── backend/
│   ├── app.py               # Flask backend
│   ├── utils.py             # Parcel class, I/O, summary utils
│   ├── parcels.json         # Parcel storage (JSON)
│   └── feedback.json        # Feedback storage (JSON)
├── frontend/
│   ├── index.html           # Main landing page
│   ├── user.html            # User dashboard
│   ├── admin.html           # Admin dashboard
│   ├── js/
│   │   └── main.js          # Frontend JS logic
│   ├── css/
│   │   └── styles.css       # UI styling & responsive layout
│   └── assets/
│       └── logo.png         # System logo
```

---

## 📊 Smart Features

* `Parcel` class with auto timestamps
* `*args`, `**kwargs` for parcel summary
* Inheritance: `User` → `Student`, `Admin`
* File I/O abstraction in `utils.py`
* Clean HTML structure with toggleable views

---

## 🎓 Presentation Notes

* Problem solved: Manual parcel tracking in hostels
* Target users: Students, Admins (Post Office staff)
* Methods used: Flask routes, JSON persistence, DOM control
* UI: Simple, mobile-friendly, dark/light toggle, toast popups

---

## 🧪 How to Run

1. Make sure Python 3 is installed.
2. Navigate to the `backend/` folder:

   ```bash
   cd backend
   python app.py
   ```
3. Open `frontend/index.html` in your browser.

---

## 📁 Notes

* No database required
* All data stored locally
* Perfect for demo or local campus use

---

## 🙌 Credits

Developed by: Group 3 
              Members - AINA INARAH BINTI MAHATHIR -
                      - AMAR SOLIHIN ABDULLAH -
                      - NUR NADIA NATASHA BINTI MUHAMAD TAIB -
                      - NURUL NAZIERAH BINTI MOHD NIZAR -
