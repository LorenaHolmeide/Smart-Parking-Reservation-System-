const navigateToHome = () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'smartParking.html';
  } else {
    alert("Please enter a username and a password");
  }
};

document.getElementById('loginButton').addEventListener('click', navigateToHome);

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault(); 
  navigateToHome();
});
