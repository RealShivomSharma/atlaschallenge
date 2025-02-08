// main.js

// URL of your Python backend (adjust as necessary)
const API_URL = "http://localhost:5000/balloon-data";

// Function to create a marker for each balloon
function createBalloonMarker(balloon) {
  // Create an a-entity for the marker
  const marker = document.createElement("a-entity");
  // Set the GPS position for the marker (requires the gps-projected-entity-place component)
  marker.setAttribute("gps-entity-place", `latitude: ${balloon.latitude}; longitude: ${balloon.longitude};`);

  // Optionally, add a visual model or primitive shape (like a box or sphere)
  // For example, a simple red sphere:
  marker.setAttribute("geometry", "primitive: sphere; radius: 1;");
  marker.setAttribute("material", "color: red; opacity: 0.7;");

  // Optionally, add a text label with the balloon ID or altitude
  const text = document.createElement("a-text");
  text.setAttribute("value", `ID: ${balloon.id}\nAlt: ${balloon.altitude}m`);
  text.setAttribute("align", "center");
  text.setAttribute("position", "0 1.5 0");
  text.setAttribute("scale", "20 20 20");

  marker.appendChild(text);
  return marker;
}

// Function to fetch balloon data from the backend
async function fetchBalloonData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching balloon data:", error);
    return [];
  }
}

// Function to update the AR scene with the latest balloon markers
async function updateBalloonMarkers() {
  const markersContainer = document.getElementById("balloon-markers");

  // Remove any existing markers
  while (markersContainer.firstChild) {
    markersContainer.removeChild(markersContainer.firstChild);
  }

  // Fetch the latest balloon data
  const balloons = await fetchBalloonData();

  // Create and append markers for each balloon
  balloons.forEach(balloon => {
    const marker = createBalloonMarker(balloon);
    markersContainer.appendChild(marker);
  });
}

// Periodically update the markers (e.g., every 30 seconds)
setInterval(updateBalloonMarkers, 30000);

// Initial update on page load
window.addEventListener("load", () => {
  // Give the AR.js components a moment to initialize
  setTimeout(updateBalloonMarkers, 2000);
});

