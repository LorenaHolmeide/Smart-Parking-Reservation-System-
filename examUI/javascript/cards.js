window.addEventListener('load', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    alert("Please login.");
    window.location.href = 'index.html';
  }
});


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

const editPaymentMethod = method => showAlert(`Editing ${method}`, "info");



