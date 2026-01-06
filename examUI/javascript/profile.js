window.addEventListener('load', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    alert("Please login.");
    window.location.href = 'index.html';
  }
});

const reservedSpotsKey = 'reservedSpots';
const parkingSpotsKey = 'parkingSpots';
const currentReservationKey = 'currentReservation';


const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem(reservedSpotsKey);
  localStorage.removeItem(currentReservationKey);
  localStorage.removeItem("vehicles");
  
  const parkingSpots = JSON.parse(localStorage.getItem(parkingSpotsKey)) || [];
  parkingSpots.forEach(spot => spot.isReserved = false);
  localStorage.setItem(parkingSpotsKey, JSON.stringify(parkingSpots));

  window.location.href = 'index.html';
};


const goBack = () => window.history.back();


document.addEventListener("DOMContentLoaded", () => {
  const reservation = JSON.parse(localStorage.getItem(currentReservationKey));
  const cancelButton = document.getElementById("cancel-reservation");
  const progressContainer = document.getElementById("progressContainer");

  if (reservation) {
    document.querySelector(".list-group-item.active h6").innerText = `Current Parking: ${reservation.name}`;
    document.querySelector(".list-group-item.active small").innerText = "now";
    document.querySelector(".list-group-item.active p.mb-1").innerText = `Remaining parking time: ${reservation.parkingTime} hour(s)`;
    document.getElementById("currentAddress").innerText = `Adr: ${reservation.address}`;
    document.getElementById("currentCar").innerText = `Car: ${reservation.licensePlate || reservation.selectedLicensePlate}`;

    cancelButton.style.display = "block";
  } else {
    cancelButton.style.display = "none";
    progressContainer.style.display = "none";

    document.querySelector(".list-group-item.active h6").innerText = "No current parking";
    document.querySelector(".list-group-item.active small").innerText = "";
    document.querySelector(".list-group-item.active p.mb-1").innerText = "";
    document.getElementById("currentAddress").innerText = "Adr:";
    document.getElementById("currentCar").innerText = "Car:";
  }
});

const showAlert = (message, type) => {
  const alertContainer = document.getElementById("alertContainer");

  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type} alert-dismissible fade show`;
  alertBox.setAttribute("role", "alert");

  const icons = {
    success: '<i class="bi bi-check-circle-fill"></i>',
    warning: '<i class="bi bi-exclamation-triangle-fill"></i>',
    info: '<i class="bi bi-info-circle-fill"></i>',
  };

  alertBox.innerHTML = `${icons[type]} ${message}`;

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


const cancelReservation = () => {
  const reservationCard = document.querySelector(".list-group-item.active");
  const cancelButton = document.getElementById("cancel-reservation");
  const progressContainer = document.getElementById("progressContainer");

  const reservedSpots = JSON.parse(localStorage.getItem(reservedSpotsKey)) || [];
  const currentReservation = JSON.parse(localStorage.getItem(currentReservationKey));
  const parkingSpots = JSON.parse(localStorage.getItem(parkingSpotsKey)) || [];

  if (currentReservation) {
    const spot = parkingSpots.find(s => s.name === currentReservation.name);
    if (spot) {
      spot.isReserved = false;

      const updatedReservedSpots = reservedSpots.filter(id => id !== spot.id);
      localStorage.setItem(reservedSpotsKey, JSON.stringify(updatedReservedSpots));
      localStorage.setItem(parkingSpotsKey, JSON.stringify(parkingSpots));
      localStorage.removeItem(currentReservationKey);
      
      localStorage.setItem("updateMarkersOnMapPage", "true");

      reservationCard.querySelector("h6").innerText = "No current parking";
      reservationCard.querySelector("small").innerText = "";
      reservationCard.querySelector("p.mb-1").innerText = "";
      document.getElementById("currentAddress").innerText = "Adr:";
      document.getElementById("currentCar").innerText = "Car:";
      cancelButton.style.display = "none";
      progressContainer.style.display = "none";

      showAlert("Your reservation has been canceled.", "info");
    }
  }
};


const resetProgress = () => {
  const progress = document.querySelector('.progress');
  progress.style.animation = 'none';
  setTimeout(() => (progress.style.animation = ''), 10);
};
