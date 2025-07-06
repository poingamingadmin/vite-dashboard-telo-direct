import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ApiDataProvider } from "./contexts/ApiDataContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

createRoot(document.getElementById("main-wrapper")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ApiDataProvider>
          <App />
        </ApiDataProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
