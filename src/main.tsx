import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";
import { SubscriptionProvider } from "./hooks/useSubscription";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <SubscriptionProvider>
            <App />
          </SubscriptionProvider>
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Registrazione Service Worker per l'App (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('PWA Service Worker registrato con successo!', reg))
      .catch(err => console.log('Errore registrazione SW:', err));
  });
}

