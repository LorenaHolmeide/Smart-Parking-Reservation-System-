window.addEventListener('load', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    alert("Please login.");
    window.location.href = 'index.html';
  }
  initializeVehicleList();
  loadVehicleList();
});


const goBack = () => window.history.back();


const initializeVehicleList = () => {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  if(vehicles.length === 0){
  const vehicleListItems = document.querySelectorAll("#vehicleList li");

  vehicleListItems.forEach(item => {
    const [yearAndNickName, licenseText] = item.textContent.split(" - License Plate: ");
    const [year, ...nickNameArray] = yearAndNickName.split(" ");
    const nickName = nickNameArray.join(" ");
    const licensePlate = licenseText.trim();

    if (!vehicles.some(vehicle => vehicle.licensePlate === licensePlate)) {
      vehicles.push({ year, nickName, licensePlate });
    }
  });

  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  }
};


const loadVehicleList = () => {
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  const vehicleList = document.getElementById("vehicleList");
  vehicleList.innerHTML = ''; 

  vehicles.forEach(vehicle => {
    const listItem = document.createElement("li");
    listItem.textContent = `${vehicle.year} ${vehicle.nickName} - License Plate: ${vehicle.licensePlate}`;
    vehicleList.appendChild(listItem);
  });
};


document.getElementById("vehicleForm").addEventListener("submit", (event) => {
  event.preventDefault(); 

  const nickName = document.getElementById("vehicleName").value;
  const year = document.getElementById("vehicleYear").value;
  const licensePlate = document.getElementById("vehicleLicensePlate").value;

  const vehicle = { nickName, year, licensePlate };
  const vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  vehicles.push(vehicle);
  localStorage.setItem("vehicles", JSON.stringify(vehicles));

  loadVehicleList();

  document.getElementById("vehicleForm").reset();
});