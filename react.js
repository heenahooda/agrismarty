/* ================================
   CONFIG
================================ */
const BASE_URL = "http://localhost:5000/api";

/* ================================
   GENERIC API HANDLER
================================ */
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

/* ================================
   API METHODS
================================ */
const API = {
  getStatus: () => request("/status"),

  sendAlert: (data) =>
    request("/alert", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

/* ================================
   DOM ELEMENTS
================================ */
const alertBtn = document.querySelector("#alertBtn");
const statusBox = document.querySelector("#statusBox");

/* ================================
   UTIL FUNCTIONS
================================ */
function showStatus(isSafe) {
  if (!statusBox) return;

  statusBox.innerHTML = `
    <span class="status ${
      isSafe ? "status-safe" : "status-alert"
    }">
      ${isSafe ? "SAFE" : "DANGER"}
    </span>
  `;
}

function showError() {
  if (!statusBox) return;

  statusBox.innerHTML = `
    <span class="status status-alert">ERROR</span>
  `;
}

/* ================================
   GET USER LOCATION (REAL FEATURE)
================================ */
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => reject("Location permission denied")
    );
  });
}

/* ================================
   LOAD INITIAL STATUS
================================ */
async function loadStatus() {
  try {
    const data = await API.getStatus();
    showStatus(data.safe);
  } catch (err) {
    showError();
  }
}

/* ================================
   ALERT HANDLER
================================ */
async function handleAlert() {
  try {
    let location = null;

    try {
      location = await getLocation();
    } catch (err) {
      console.warn("Location not available");
    }

    await API.sendAlert({
      time: new Date().toISOString(),
      location,
    });

    alert("🚨 Alert Sent Successfully");
  } catch (err) {
    alert("❌ Failed to send alert");
  }
}

/* ================================
   EVENT LISTENERS
================================ */
if (alertBtn) {
  alertBtn.addEventListener("click", handleAlert);
}

/* ================================
   INIT APP
================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadStatus();
});