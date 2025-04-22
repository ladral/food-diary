import { KeycloakProvider } from "./context/KeycloakContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/Home.tsx";
import SilentCheckSsoRedirect from "./pages/SilentCheckSsoRedirect.tsx";
import AnalysisPage from "./pages/Analysis.tsx";
import Navigation from "./components/layout/Navigation.tsx";
import Header from "./components/layout/Header.tsx";

function App() {

    return (
        <KeycloakProvider>
            <BrowserRouter>
                <div className="page u-h-100-vh is-flex is-flex-direction-column">
                    <Header></Header>
                    <div className="is-flex-grow-1 is-flex is-flex-direction-row u-overflow-auto">
                        <aside className="sidebar">
                            <Navigation></Navigation>
                        </aside>
                        <div className="container px-4">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/analysis" element={<AnalysisPage />} />
                                <Route path="/silent-check-sso" element={<SilentCheckSsoRedirect />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        </KeycloakProvider>
);
}

export default App;
