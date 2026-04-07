import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
    <AuthProvider>
      <CurrencyProvider>
      <App />
    </CurrencyProvider>
    </AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#ffffff",
            border: "1px solid rgba(51,65,85,0.6)",
          },
        }}
      />
    </>
  </BrowserRouter>
);