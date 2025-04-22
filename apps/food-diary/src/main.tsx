import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.scss";
import "./assets/icons/fodd-diary-icons.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
