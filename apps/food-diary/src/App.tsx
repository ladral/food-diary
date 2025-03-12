import { KeycloakProvider } from "./context/KeycloakContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import "./App.scss";
import HomePage from "./pages/Home.tsx";
import SilentCheckSsoRedirect from "./pages/SilentCheckSsoRedirect.tsx";

function App() {

    return (
        <KeycloakProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/silent-check-sso" element={<SilentCheckSsoRedirect/>} />
                </Routes>
            </BrowserRouter>
        </KeycloakProvider>
    );
}

export default App;
