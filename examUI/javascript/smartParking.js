const map = L.map('map').setView([59.9281, 10.7169], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

const availableIcon = L.divIcon({
  html: '<i class="bi bi-p-square-fill" style="font-size: 30px; color: blue;"></i>',
  iconSize: [20, 20],
  className: ''
});

const reservedIcon = L.divIcon({
  html: '<i class="bi bi-p-square-fill" style="font-size: 30px; color: burgundy;"></i>',
  iconSize: [20, 20],
  className: ''
});

/*
Sources: 

OpenStreetMap, “OpenStreetMap,” n.d. [Online]. Available: https://www.openstreetmap.org/. [Accessed: October 28, 2024]. 

Leaflet, “Leaflet,” n.d. Leaflet - an open-source JavaScript library for mobile-friendly interactive maps. [Online]. Available: https://leafletjs.com/. [Accessed: October 28, 2024].

*/


const parkingSpots = [
  { id: 1, name: "Parking A", address: "Jacob Aalls gate 10, 0368 Oslo", street: "Jacob Aalls gate 10", isReserved: false },
  { id: 2, name: "Parking B", address: "Jacob Aalls gate 18, 0368 Oslo", street: "Jacob Aalls gate 18", isReserved: false },
  { id: 3, name: "Parking C", address: "Arbos gate 1A, 0368 Oslo", street: "Arbos gate 1A", isReserved: false },
  { id: 4, name: "Parking D", address: "Bogstadveien 46, 0366 Oslo", street: "Bogstadveien 46", isReserved: false },
  { id: 5, name: "Parking E", address: "Valkyriegata 17, 0366 Oslo", street: "Valkyriegata 17", isReserved: false },
  { id: 6, name: "Parking F", address: "Sorgenfrigata 6B, 0367 Oslo", street: "Sorgenfrigata 6B", isReserved: false },
  { id: 7, name: "Parking G", address: "Schultz' gate 1, 0365 Oslo", street: "Schultz' gate 1", isReserved: false },
  { id: 8, name: "Parking H", address: "Gjørstads gate 6, 0367 Oslo", street: "Gjørstads gate 6", isReserved: false },
  { id: 9, name: "Parking I", address: "Ole Vigs gate 19B, 0366 Oslo", street: "Ole Vigs gate 19B", isReserved: false },
  { id: 10, name: "Parking J", address: "Neuberggata 24, 0367 Oslo", street: "Neuberggata 24", isReserved: false },
  { id: 11, name: "Parking K", address: "Neuberggata 21, 0367 Oslo", street: "Neuberggata 21", isReserved: false },
  { id: 12, name: "Parking L", address: "Majorstuveien 20, 0367 Oslo", street: "Majorstuveien 20", isReserved: false },
  { id: 13, name: "Parking M", address: "Jacob Aalls gate 28, 0366 Oslo", street: "Jacob Aalls gate 28", isReserved: false },
  { id: 14, name: "Parking N", address: "Bogstadveien 43, 0366 Oslo", street: "Bogstadveien 43", isReserved: false },
  { id: 15, name: "Parking O", address: "Majorstuveien 38C, 0367 Oslo", street: "Majorstuveien 38C", isReserved: false },
  { id: 16, name: "Parking P", address: "Majorstuveien 31, 0367 Oslo", street: "Majorstuveien 31", isReserved: false }
];

const reservedSpotsKey = 'reservedSpots';
const parkingSpotsKey = 'parkingSpots';
const currentReservationKey = 'currentReservation';

let allMarkers = [];
let selectedSpot = null;
let reservationModal;


document.addEventListener("DOMContentLoaded", () => {
  initializeVehicleList(); 
  reservationModal = new bootstrap.Modal(document.getElementById('reservationModal'));
  document.getElementById('reservationModal').addEventListener('hidden.bs.modal', resetFormState);
  loadReservedSpots();
  addParkingMarkersFromAddresses(parkingSpots);
  if (localStorage.getItem("updateMarkersOnMapPage") === "true") {
    updateMarkers(); 
    localStorage.removeItem("updateMarkersOnMapPage"); 
  }
});

const initializeVehicleList = () => {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  if (vehicles.length === 0) {
    vehicles.push(
      { year: "2020", nickName: "Dory", licensePlate: "AS 12349" },
      { year: "2018", nickName: "Batmobile", licensePlate: "EV 95678" }
    );
    localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }
};
window.addEventListener('storage', (event) => {
  if (event.key === "vehicles") {
    populateVehicleDropdown(); 
  }
});

const loadReservedSpots = () => {
  const reservedSpots = JSON.parse(localStorage.getItem(reservedSpotsKey)) || [];
  parkingSpots.forEach(spot => {
    spot.isReserved = reservedSpots.includes(spot.id);
  });
  localStorage.setItem(parkingSpotsKey, JSON.stringify(parkingSpots));
};


const addParkingMarkersFromAddresses = async (parkingData) => {
  allMarkers = [];
  const bounds = [];

  for (const spot of parkingData) {
    const coordinates = await getCoordinates(spot.address);

    if (coordinates) {
      const icon = spot.isReserved ? reservedIcon : availableIcon;
      const marker = L.marker([coordinates.lat, coordinates.lon], { icon: icon, zIndexOffset: 1000 }).addTo(map);
      const popupContent = `
        <strong>${spot.name}</strong><br>${spot.street}<br>
        <button class="reserve-button" onclick="openReservationModal(${spot.id})">Reserve</button>
      `;
      marker.bindPopup(popupContent);
      allMarkers.push(marker);
      bounds.push([coordinates.lat, coordinates.lon]);
    }
  }
  if (bounds.length > 0) {
    map.fitBounds(bounds);
  }
};



const openReservationModal = (spotId) => {
  const reservedSpots = JSON.parse(localStorage.getItem(reservedSpotsKey)) || [];
  const parkingSpots = JSON.parse(localStorage.getItem(parkingSpotsKey)) || [];
  selectedSpot = parkingSpots.find(s => s.id === spotId);

  if (selectedSpot) {
    const isSpotReserved = selectedSpot.isReserved || reservedSpots.includes(selectedSpot.id);
    if (isSpotReserved) {
      showAlert("This spot is already reserved. Please select another spot.", "warning");
    } else {
      document.getElementById('reservationModalLabel').innerText = `Reserve ${selectedSpot.name}`;
      populateVehicleDropdown();
      reservationModal.show();
      
    }
  }
};

const confirmReservation = () => {
  const parkingTime = document.getElementById('parkingTime').value;
  const licensePlate = document.getElementById('licensePlate').value;
  const selectedDuration = document.querySelector('input[name="duration"]:checked');
  const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
  const selectedLicensePlate = document.getElementById("vehicleDropdown").value;

  if (!parkingTime && !selectedDuration) {
    showAlert("Please enter the parking time or select a duration option.", "warning");
    return;
  }
  if (!licensePlate && !selectedLicensePlate) {
    showAlert("Please enter or select the license plate number.", "warning");
    return;
  }
  if (!selectedPaymentMethod) {
    showAlert("Please select a payment method.", "warning");
    return;
  }
  selectedSpot.isReserved = true;
  const reservationDetails = {
    name: selectedSpot.name,
    address: selectedSpot.address,
    licensePlate: licensePlate || selectedLicensePlate,
    parkingTime: parkingTime || selectedDuration.value
  };
  localStorage.setItem(currentReservationKey, JSON.stringify(reservationDetails));

  const reservedSpots = JSON.parse(localStorage.getItem(reservedSpotsKey)) || [];
  reservedSpots.push(selectedSpot.id);
  localStorage.setItem(reservedSpotsKey, JSON.stringify(reservedSpots));

  const updatedParkingSpots = parkingSpots.map(spot =>
    spot.id === selectedSpot.id ? { ...spot, isReserved: true } : spot
  );
  localStorage.setItem(parkingSpotsKey, JSON.stringify(updatedParkingSpots));

  reservationModal.hide();
  openReservationOverlay(selectedSpot.name);
  showAlert(`Reservation confirmed ${selectedSpot.name}. Parking Time: ${parkingTime || selectedDuration.value}. License Plate: ${licensePlate || selectedLicensePlate}`, "success");
  resetFormState();
  loadReservedSpots();
  setTimeout(updateMarkers, 100);

};

const populateVehicleDropdown = () => {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  const vehicleDropdown = document.getElementById("vehicleDropdown"); 
  vehicleDropdown.innerHTML = '<option selected="">Select your vehicle</option>';

  vehicles.forEach(vehicle => {
    const option = document.createElement("option");
    option.value = vehicle.licensePlate;
    option.textContent = `${vehicle.year} ${vehicle.nickName} - License Plate: ${vehicle.licensePlate}`;
    vehicleDropdown.appendChild(option);
  });
  
};

const getCoordinates = async (address) => {
  const cachedCoordinates = localStorage.getItem(`geocode_${address}`);
  if (cachedCoordinates) {
    return JSON.parse(cachedCoordinates);
  }
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.length > 0) {
      const coordinates = { lat: data[0].lat, lon: data[0].lon };
      localStorage.setItem(`geocode_${address}`, JSON.stringify(coordinates));
      return coordinates;
    } else {
      console.error(`No result for this address: ${address}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
/*
Source:
Nominatim, “Nominatim,” n.d. Open-source geocoding with OpenStreetMap data. [Online]. Available: https://nominatim.org/. [Accessed: October 29, 2024].
*/


const updateMarkers = () => {
  removeAllMarkers();
  addParkingMarkersFromAddresses(parkingSpots);
};


const showAlert = (message, type) => {
  const alertContainer = document.getElementById("alertContainer");
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type} alert-dismissible fade show`;
  alertBox.setAttribute("role", "alert");

  let icon;

  if (type === 'success') {
    icon = '<i class="bi bi-check-circle-fill"></i>';
  } else if (type === 'warning') {
    icon = '<i class="bi bi-exclamation-triangle-fill"></i>';
  } else if (type === 'info') {
    icon = '<i class="bi bi-info-circle-fill"></i>';
  }

  alertBox.innerHTML = `${icon} ${message}`;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");
  alertBox.appendChild(closeButton);

  alertContainer.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.remove("show");
    alertBox.classList.add("fade");
    setTimeout(() => alertBox.remove(), 500);
  }, 7000);
};


const removeAllMarkers = () => {
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];
};


const searchLocation = async () => {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();

  if (!query) {
    showAlert("Please enter an address", "warning");
    return;
  }
  removeAllMarkers();

  const filteredSpots = parkingSpots.filter(spot =>
    spot.address.toLowerCase().includes(query)
  );

  if (filteredSpots.length > 0) {
    await addParkingMarkersFromAddresses(filteredSpots);
    showAlert("Parking spots found and marked on the map!", "success");
  } else {
    showAlert("No available parking spots found for this address. Please try 'Sorgenfrigata' or 'Bogstadveien'", "info");
  }
};


const parkingTimeInput = document.getElementById('parkingTime');
const durationRadios = document.querySelectorAll('input[name="duration"]');

const toggleDurationRadios = () => {
  const hasParkingTime = parkingTimeInput.value.length > 0;
  durationRadios.forEach(radio => {
    radio.disabled = hasParkingTime;
    if (hasParkingTime) radio.checked = false;
  });
};
parkingTimeInput.addEventListener('input', toggleDurationRadios);

const licensePlateInput = document.getElementById('licensePlate');
const selectedLicensePlateDropdown = document.getElementById('vehicleDropdown');

const toggleLicensePlateFields = () => {
  if (licensePlateInput.value.trim() !== '') {
    selectedLicensePlateDropdown.setAttribute('disabled', true);
  } else {
    selectedLicensePlateDropdown.removeAttribute('disabled');
  }

  if (selectedLicensePlateDropdown.selectedIndex > 0) { 
    licensePlateInput.setAttribute('disabled', true);
  } else {
    licensePlateInput.removeAttribute('disabled');
  }
};

licensePlateInput.addEventListener('input', toggleLicensePlateFields);
selectedLicensePlateDropdown.addEventListener('cange', toggleLicensePlateFields);


const resetFormState = () => {
  parkingTimeInput.value = '';
  durationRadios.forEach(radio => {
    radio.disabled = false;
    radio.checked = false;
  });
  document.getElementById('totalCost').textContent = 'NOK 0';
  licensePlateInput.disabled = false;
  selectedLicensePlateDropdown.value = '';
  selectedLicensePlateDropdown.disabled = false;
};


const openReservationOverlay = (spotName) => {
  document.getElementById('reservation-spot').textContent = `Selected Spot: ${spotName}`;
  document.getElementById('reservation-overlay').style.display = 'flex';
};

const resetProgress = () => {
  const progress = document.querySelector('.progress');
  progress.style.animation = 'none';
  setTimeout(() => (progress.style.animation = ''), 10);
};

const closeReservationOverlay = () => {
  document.getElementById('reservation-overlay').style.display = 'none';
  showAlert("You can view your reservation on your profile page", "info")
};

const cancelReservationOverlay = () => {
  document.getElementById('reservation-overlay').style.display = 'none';
  if (selectedSpot) {
    const reservedSpots = JSON.parse(localStorage.getItem(reservedSpotsKey)) || [];
    const updatedReservedSpots = reservedSpots.filter(id => id !== selectedSpot.id);
    localStorage.setItem(reservedSpotsKey, JSON.stringify(updatedReservedSpots));

    const updatedParkingSpots = parkingSpots.map(spot =>
      spot.id === selectedSpot.id ? { ...spot, isReserved: false } : spot
    );
    localStorage.setItem(parkingSpotsKey, JSON.stringify(updatedParkingSpots));

    localStorage.removeItem(currentReservationKey);
    showAlert(`Reservation canceled for ${selectedSpot.name}.`, "info");
    selectedSpot = null;
    resetProgress();
    loadReservedSpots();
    updateMarkers();
  }
};


let selectedPaymentMethod = '';

const selectPaymentMethod = (method) => {
  selectedPaymentMethod = method;

  document.querySelectorAll('.payment-method').forEach(item => {
    item.classList.remove('selected');
  });

  document.getElementById(`payment-${method}`).parentElement.classList.add('selected');
};

const calculateCost = () => {
  const ratePerMinute = 1.3;
  const minutes = document.getElementById('parkingTime').value;
  const cost = minutes * ratePerMinute;
  document.getElementById('totalCost').textContent = `NOK ${cost.toFixed(2) || 0}`;
};


let parkingCost = 0;

const setParkingCost = (cost) => {
  parkingCost = cost;
  updateTotalCost();
};

const updateTotalCost = () => {
  document.getElementById('totalCost').textContent = `NOK ${parkingCost}`;
};


