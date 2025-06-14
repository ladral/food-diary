import { KeycloakProvider } from "./context/KeycloakContext";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.scss";
import SilentCheckSsoRedirect from "./pages/authentication/SilentCheckSsoRedirect.tsx";
import { AlertProvider } from "./context/AlertContext.tsx";
import React, { lazy, useEffect } from "react";
import useKeycloak from "./hooks/useKeycloak.ts";

const DiaryPage = lazy(() => import("./pages/diary/Diary.tsx"));
const AnalysisPage = lazy(() => import("./pages/analysis/Analysis.tsx"));

function App() {

    interface ProtectedRouteProps {
        redirectPath?: string;
    }

    const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
        const { authenticated, keycloak } = useKeycloak();

        useEffect(() => {
            if (!authenticated) {
                const redirectUrl = `${window.location.origin}`;
                keycloak?.login({ redirectUri: redirectUrl });
            }
        }, [authenticated, keycloak]);

        return <Outlet />;
    };

    return (
        <KeycloakProvider>
            <AlertProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<DiaryPage />} />
                            <Route path="/analysis" element={<AnalysisPage />} />
                        </Route>
                        <Route path="/silent-check-sso" element={<SilentCheckSsoRedirect />} />
                    </Routes>
                </BrowserRouter>
            </AlertProvider>
        </KeycloakProvider>
    );
}

export default App;
