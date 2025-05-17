import { KeycloakProvider } from "./context/KeycloakContext";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.scss";
import SilentCheckSsoRedirect from "./pages/authentication/SilentCheckSsoRedirect.tsx";
import Navigation from "./components/layout/Navigation.tsx";
import Header from "./components/layout/Header.tsx";
import Footer from "./components/layout/Footer.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";
import React, { lazy, useEffect } from "react";
import useKeycloak from "./hooks/useKeycloak.ts";

const DiaryPage = lazy(() => import("./pages/diary/Diary.tsx"));
const AnalysisPage = lazy(() => import("./pages/analysis/Analysis.tsx"));

function App() {

    interface ProtectedRouteProps {
        redirectPath?: string;
    }

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/" }) => {
        const { authenticated, keycloak } = useKeycloak();

        useEffect(() => {
            if (!authenticated) {
                keycloak?.login();
            }
        }, [authenticated, keycloak]);

        if (!authenticated) {
            return <Navigate to={redirectPath} replace />;
        }

        return <Outlet />;

    };

    return (
        <KeycloakProvider>
            <AlertProvider>
                <BrowserRouter>
                    <div className="page u-h-100-vh is-flex is-flex-direction-column">
                        <Header></Header>
                        <div className="is-flex-grow-1 is-flex is-flex-direction-column u-overflow-auto">
                            <div className="is-flex is-flex-grow-1 is-flex-direction-row u-overflow-auto">
                                <aside className="sidebar">
                                    <Navigation></Navigation>
                                </aside>
                                <div className="container px-4 u-w-100">
                                    <Routes>
                                        <Route element={<ProtectedRoute />}>
                                            <Route path="/" element={<DiaryPage />} />
                                            <Route path="/analysis" element={<AnalysisPage />} />
                                        </Route>
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
