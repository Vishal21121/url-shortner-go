import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import UserContextProvider from "./context/UserContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer
      position="bottom-left"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    <BrowserRouter>
      {/* <UserContextProvider> */}
      <App />
      {/* </UserContextProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
