function initAnalytics() {
  // Check if the environment is not development
  if (process.env.NODE_ENV === "development") {
    console.log("Development environment, analytics not loaded");
    return;
  }

  console.log("Production environment, analytics loaded");

  // Load cookieeyes script
  const cookieeyes = document.createElement("script");
  cookieeyes.id = "cookieyes";
  cookieeyes.type = "text/javascript";
  cookieeyes.src =
    "https://cdn-cookieyes.com/client_data/a6e08531352539bd861c31d7/script.js";
  document.head.appendChild(cookieeyes);

  // Load Google Analytics script

  const googleAnalytics = document.createElement("script");
  googleAnalytics.id = "google-analytics";
  googleAnalytics.type = "text/javascript";
  googleAnalytics.async = true;
  googleAnalytics.src =
    "https://www.googletagmanager.com/gtag/js?id=G-JDDWYV8YLD";
  document.head.appendChild(googleAnalytics);

  // Initialize Google Analytics

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());

  gtag("config", "G-JDDWYV8YLD");
}
