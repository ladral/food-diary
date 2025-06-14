import React, {
    createContext,
    useEffect,
    useState,
    useRef
} from "react";
import Keycloak from "keycloak-js";
import logger from "../services/logging/Logger.ts";

interface KeycloakContextProps {
    keycloak: Keycloak | null;
    authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(
    undefined
);

interface KeycloakProviderProps {
    children: React.ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
    const isRun = useRef<boolean>(false);
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const ONE_MINUTE = 60000;
    const TOKEN_EXPIRATION_BUFFER_SECONDS = 30;

    useEffect(() => {
        if (isRun.current) return;

        isRun.current = true;

        const initKeycloak = async () => {
            const keycloakConfig = {
                url: import.meta.env.VITE_KEYCLOAK_URL as string,
                realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
                clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string
            };
            const keycloakInstance: Keycloak = new Keycloak(keycloakConfig);

            keycloakInstance
                .init({
                    onLoad: "check-sso",
                    silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso`
                })
                .then((authenticated: boolean) => {
                    setAuthenticated(authenticated);
                })
                .catch((error) => {
                    logger.error("Keycloak initialization failed:", error);
                    setAuthenticated(false);
                })
                .finally(() => {
                    setKeycloak(keycloakInstance);
                    logger.debug("successfully set keycloak instance");
                });
        };

        initKeycloak();
    }, []);

    useEffect(() => {
        const refreshToken = async () => {
            if (keycloak) {
                try {
                    await keycloak.updateToken(TOKEN_EXPIRATION_BUFFER_SECONDS);
                } catch (error) {
                    logger.error("Failed to refresh token:", error);
                    setAuthenticated(false);
                }
            }
        };

        const interval = setInterval(refreshToken, ONE_MINUTE);

        return () => clearInterval(interval);
    }, [keycloak]);

    return (
        <KeycloakContext.Provider value={{ keycloak, authenticated }}>
            {children}
        </KeycloakContext.Provider>
    );
};

export { KeycloakProvider, KeycloakContext };
