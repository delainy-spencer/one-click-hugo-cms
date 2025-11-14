let auth0Client;

window.onload = async () => {
  // Initialize Auth0
  auth0Client = await createAuth0Client({
    domain: "YOUR_DOMAIN.auth0.com",
    client_id: "YOUR_CLIENT_ID",
    cacheLocation: "localstorage"
  });

  // Check if user is logged in
  const isAuthenticated = await auth0Client.isAuthenticated();
  toggleButtons(isAuthenticated);

  // Handle redirect callback from Auth0
  if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/"); // remove query params
    toggleButtons(true);
  }
};

function toggleButtons(isLoggedIn) {
  document.getElementById("login-btn").classList.toggle("hidden", isLoggedIn);
  document.getElementById("logout-btn").classList.toggle("hidden", !isLoggedIn);

  if (isLoggedIn) {
    // Optionally show user info
    auth0Client.getUser().then(user => {
      document.getElementById("user-info").textContent = `Hello, ${user.name || user.email}`;
    });
  }
}

// Login function (called by your nav button)
async function login() {
  await auth0Client.loginWithRedirect({
    redirect_uri: window.location.origin + "/about" // change as needed
  });
}

// Logout function
function logout() {
  auth0Client.logout({
    returnTo: window.location.origin + "/contact" // change as needed
  });
}