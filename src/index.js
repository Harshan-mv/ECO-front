import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";
import "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


// Importing external JS files

import "./assets/js/jquery.1.11.1.js";
import "./assets/js/bootstrap.js";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable service worker for PWA support
serviceWorker.register();

// Performance monitoring (optional)
reportWebVitals(console.log);
