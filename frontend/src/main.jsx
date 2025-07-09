import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";

import { BrowserRouter } from "react-router-dom";

axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL; // Set the base URL

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
