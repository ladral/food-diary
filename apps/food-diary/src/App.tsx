import { KeycloakProvider } from "./context/KeycloakContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import HomePage from "./pages/Home.tsx";
import SilentCheckSsoRedirect from "./pages/SilentCheckSsoRedirect.tsx";
import AnalysisPage from "./pages/Analysis.tsx";
import Navigation from "./components/layout/Navigation.tsx";
import Header from "./components/layout/Header.tsx";
import Footer from "./components/layout/Footer.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";

function App() {

    return (
        <KeycloakProvider>
            <AlertProvider>
                <BrowserRouter>
                    <div className="page u-h-100-vh is-flex is-flex-direction-column">
                        <Header></Header>
                        <div className="is-flex-grow-1 is-flex is-flex-direction-column u-overflow-auto">
                            <div className="is-flex is-flex-grow-1 is-flex-direction-row">
                                <aside className="sidebar">
                                    <Navigation></Navigation>
                                </aside>
                                <div className="container px-4 u-w-100">
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/analysis" element={<AnalysisPage />} />
                                        <Route path="/silent-check-sso" element={<SilentCheckSsoRedirect />} />
                                    </Routes>
                                </div>
                            </div>
                            <Footer></Footer>
                        </div>
                    </div>
                </BrowserRouter>
            </AlertProvider>
        </KeycloakProvider>
    );
}

export default App;
