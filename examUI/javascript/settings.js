
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

const comfirmMsg = edit => showAlert(`${edit}`, "info");
const contactMsg = msg => showAlert(`You can now contact support: ${msg}`, "info");

const deleteAccount = method => {
  if (confirm(`Are you sure you want to delete your account?`)) {
    showAlert(`${method}`, "success");
  }
};


const pushNotificationsCheckbox = document.getElementById("pushNotifications");
const emailAlertsCheckbox = document.getElementById("emailAlerts");
const themeModeCheckbox = document.getElementById("themeMode");

const handleCheckboxChange = (checkbox, featureName) => {
  if (checkbox.checked) {
    showAlert(`${featureName} enabled.`, "success");
  } else {
    showAlert(`${featureName} disabled.`, "info");
  }
};


pushNotificationsCheckbox.addEventListener("change", () =>
  handleCheckboxChange(pushNotificationsCheckbox, "Push notifications")
);

emailAlertsCheckbox.addEventListener("change", () =>
  handleCheckboxChange(emailAlertsCheckbox, "Email alerts")
);
themeModeCheckbox.addEventListener("change", () =>
  handleCheckboxChange(themeModeCheckbox, "Dark mode")
);



const languageSelect = document.getElementById("languageSelect");

const handleLanguageChange = () => {
  const selectedOption = languageSelect.options[languageSelect.selectedIndex];
  const language = selectedOption.text; 
  const languageCode = selectedOption.value;

  if (languageCode === "no") {
    showAlert(`Språket er endret til Norsk.`, "info");
  } else {
    showAlert(`Language changed to ${language}.`, "info");
  }
};

languageSelect.addEventListener("change", handleLanguageChange);
