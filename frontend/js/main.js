let userName = "";
let userMatric = "";

function userLogin() {
  const name = document.getElementById("username").value.trim();
  const matric = document.getElementById("matric").value.trim();

  if (!name || !matric) {
    alert("Please enter both name and matric number.");
    return;
  }

  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, matric })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        userName = name;
        userMatric = matric;
        document.getElementById("welcome").innerText = `Welcome ${name} (${matric})`;
        showToast("Login successful");
        document.getElementById("login-section").style.display = "none";
        document.getElementById("user-section").style.display = "block";
      }
    });
}

function searchParcel() {
  const track = document.getElementById("track-number").value.trim();
  fetch("http://127.0.0.1:5000/parcels/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracking: track, matric: userMatric })
  })
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("track-result");
      if (data.error) {
        showToast("❌ Parcel not found or not yours.");
      } else {
        box.innerHTML = `
          <strong>📦 Tracking:</strong> ${data.tracking_number}<br/>
          <strong>👤 Name:</strong> ${data.name} (${data.matric})<br/>
          <strong>🏢 Building:</strong> ${data.building}<br/>
          <strong>🚚 Method:</strong> ${data.method}<br/>
          <strong>📌 Status:</strong> ${data.status}<br/>
          <strong>💰 Charge:</strong> RM ${parseFloat(data.charge).toFixed(2)}<br/>
          <strong>🕒 Estimated Pickup:</strong> ${data.estimated_pickup || "-"}<br/>
          <strong>🗓️ Created:</strong> ${data.timestamp}<br/>
          <strong>🔄 Updated:</strong> ${data.updated_at}
        `;
        showToast("✅ Parcel found!");
      }
    });
}

function loadHistory() {
  fetch(`http://127.0.0.1:5000/parcels/user/${userMatric}`)
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("history");
      box.innerHTML = "";

      if (data.length === 0) {
        box.innerHTML = "<p>No parcels in history.</p>";
        return;
      }

      data.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("parcel-card");
        div.innerHTML = `
          <strong>📦 Tracking:</strong> ${p.tracking_number}<br/>
          <strong>👤 Name:</strong> ${p.name} (${p.matric})<br/>
          <strong>🏢 Building:</strong> ${p.building}<br/>
          <strong>🚚 Method:</strong> ${p.method}<br/>
          <strong>📌 Status:</strong> ${p.status}<br/>
          <strong>💰 Charge:</strong> RM ${parseFloat(p.charge).toFixed(2)}<br/>
          <strong>🕒 Estimated Pickup:</strong> ${p.estimated_pickup || "-"}<br/>
          <strong>🗓️ Created:</strong> ${p.timestamp}<br/>
          <strong>🔄 Updated:</strong> ${p.updated_at}
        `;
        box.appendChild(div);
      });
    });
}

function loadPickupTimes() {
  fetch(`http://127.0.0.1:5000/parcels/user/${userMatric}`)
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("pickup-times");
      box.innerHTML = "";
      data.forEach(p => {
        if (p.status === "Pickup Ready") {
          box.innerHTML += `<p>Tracking: ${p.tracking_number}, Building: ${p.building}, Time: ${p.estimated_pickup}</p>`;
        }
      });
      if (box.innerHTML === "") box.innerText = "No parcels ready for pickup.";
    });
}

function loadSummary() {
  fetch(`http://127.0.0.1:5000/parcels/summary/${userMatric}`)
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("summary");
      box.innerHTML = `
        <strong>👤 Matric:</strong> ${data.user}<br/>
        <strong>📦 Total Parcels:</strong> ${data.total}<br/>
        <strong>💰 Total Charges:</strong> RM ${parseFloat(data.charges).toFixed(2)}<br/>
        <strong>📌 Parcel Statuses:</strong><br/>
        <ul style="padding-left: 20px;">
          ${Object.entries(data.by_status).map(([status, count]) =>
            `<li>${status}: ${count}</li>`
          ).join('')}
        </ul>
      `;
    });
}

function changeDelivery() {
  const track = document.getElementById("change-track").value.trim();
  const method = document.getElementById("change-method").value;

  fetch("http://127.0.0.1:5000/parcels/update-method", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tracking_number: track,
      matric: userMatric,
      method
    })
  })
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("change-result");
      if (data.error) {
        box.innerText = data.error;
      } else {
        showToast(`Parcel marked as ${data.status}`);
        box.innerText = "";
      }
    });
}

function submitFeedback() {
  const rating = parseInt(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value.trim();
  const box = document.getElementById("feedback-result");

  if (!rating || rating < 1 || rating > 5 || !comment) {
    box.innerText = "Please enter valid rating (1-5) and comment.";
    return;
  }

  fetch("http://127.0.0.1:5000/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userName,
      matric: userMatric,
      rating,
      comment
    })
  })
    .then(res => res.json())
    .then(data => {
      showToast("Feedback submitted! Thank you.");
      box.innerText = "";
      document.getElementById("rating").value = "";
      document.getElementById("comment").value = "";
    });
}
function adminLogin() {
  const username = document.getElementById("admin-user").value;
  const password = document.getElementById("admin-pass").value;

  fetch("http://127.0.0.1:5000/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToast("❌ " + data.error);
      } else {
        showToast("✅ Admin login successful");
        document.getElementById("admin-login").style.display = "none";
        document.getElementById("admin-section").style.display = "block";
      }
    });
}

function addParcel() {
  const name = document.getElementById("p-name").value.trim();
  const matric = document.getElementById("p-matric").value.trim();
  const tracking = document.getElementById("p-tracking").value.trim();
  const building = document.getElementById("p-building").value;

  if (!name || !matric || !tracking) {
    showToast("❌ Please fill in all required fields.");
    return;
  }

  fetch("http://127.0.0.1:5000/parcels/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, matric, tracking_number: tracking, building })
  })
    .then(res => res.json())
    .then(data => {
      showToast("✅ Parcel added successfully!");
      document.getElementById("add-result").innerText = data.message;
      document.getElementById("p-name").value = "";
      document.getElementById("p-matric").value = "";
      document.getElementById("p-tracking").value = "";
    })
    .catch(() =>{
      showToast("❌ Failed to add parcel. Please try again.");
    });
}

function loadAllParcels() {
  const buildingFilter = document.getElementById("filter-building").value;
  const statusFilter = document.getElementById("filter-status").value;

  fetch("http://127.0.0.1:5000/parcels")
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("parcel-list");
      box.innerHTML = "";

      const filtered = data.filter(p => {
        const matchBuilding = !buildingFilter || p.building === buildingFilter;
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchBuilding && matchStatus;
      });

      if (filtered.length === 0) {
        box.innerHTML = "<p>No parcels match the filters.</p>";
        return;
      }

      filtered.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("parcel-card");
        div.innerHTML = `
          <strong>📦 ${p.tracking_number}</strong><br/>
          👤 <b>${p.name}</b> (${p.matric})<br/>
          🏢 Building: ${p.building}<br/>
          🚚 Method: ${p.method}<br/>
          🏷️ Status: <span class="status-label">${p.status}</span><br/>
          💰 RM${p.charge.toFixed(2)}<br/>
          🕒 Added: ${p.timestamp}<br/>
          🔄 Updated: ${p.updated_at}
        `;
        box.appendChild(div);
      });
    });
}

function markPickedUp() {
  const tracking = document.getElementById("pickup-track").value.trim();
  if (!tracking) return;

  fetch("http://127.0.0.1:5000/parcels/pickup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracking_number: tracking })
  })
    .then(res => res.json())
    .then(data => {
      showToast(data.message || data.error);
      document.getElementById("pickup-track").value = "";
    });
}

function exportCSV() {
  window.open("http://127.0.0.1:5000/parcels/export", "_blank");
  showToast("CSV export started")
}

function loadFeedback() {
  fetch("http://127.0.0.1:5000/feedback")
    .then(res => res.json())
    .then(data => {
      const box = document.getElementById("feedback-list");
      box.innerHTML = "";
      data.forEach(f => {
        box.innerHTML += `
          <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
            <strong>${f.name} (${f.matric})</strong><br/>
            Rating: ${f.rating}/5<br/>
            "${f.comment}"<br/>
            <em>${f.timestamp}</em>
          </div>`;
      });
    });
}

function clearParcels() {
  if (!confirm("Are you sure you want to delete ALL parcel data? This cannot be undone.")) return;

  fetch("http://127.0.0.1:5000/parcels/clear", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      showToast(data.message);
      document.getElementById("parcel-list").innerHTML = "";
    });
}

function showTab(id) {
  const tabs = document.querySelectorAll(".tab-section");
  tabs.forEach(tab => tab.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Auto-apply saved theme on load
window.addEventListener("load", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
