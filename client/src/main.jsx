import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/UserContextProvider.jsx";
import { Toaster } from "react-hot-toast";
import UrlContextProvider from "./context/UrlContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <UserContextProvider>
        <UrlContextProvider>
          <App />
        </UrlContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
