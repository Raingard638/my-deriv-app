// Public settings. The client ID is NOT a secret.
// Replace with the app ID Deriv gives you after you register the app.
window.MARKETPIP = {
  clientId: "YOUR_DERIV_CLIENT_ID",
  // Must exactly match the redirect URL you register on Deriv.
  redirectUri: window.location.origin + "/callback.html",
  scope: "trade"
};
