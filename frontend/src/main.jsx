import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
import { LoginState } from "./LoginState";
axios.defaults.withCredentials = true;

export const backend_server = `https://library-management-rzpi.onrender.com`;

ReactDOM.createRoot(document.getElementById("root")).render(
  <LoginState>
    <App />
  </LoginState>
);