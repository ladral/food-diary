import React, { createContext, useContext, useState } from "react";
import { Alert, Snackbar, Stack } from "@mui/material";
import { Severity } from "../models/alerts/Severity.ts";
import styles from "./AlertContext.module.scss";

interface AlertContextType {
    addAlert: (message: string, severity: Severity) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
    children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [alerts, setAlerts] = useState<{ id: number; message: string; severity: Severity }[]>([]);
    const [open, setOpen] = useState(false);

    const addAlert = (message: string, severity: Severity) => {
        const id = new Date().getTime();
        setAlerts((alerts) => [...alerts, { id, message, severity }]);
        setOpen(true);

        setTimeout(() => {
            handleClose(id);
        }, 30000);
    };

    const handleClose = (id: number) => {
        setAlerts((alerts) => alerts.filter(alert => alert.id !== id));
        if (alerts.length === 1) {
            setOpen(false);
        }
    };

    return (
        <AlertContext.Provider value={{ addAlert }}>
            {children}
            <Snackbar
                open={open}
                onClose={() => {}}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Stack className={`${styles.stack} is-flex is-flex-direction-column`} spacing={9}>
                    {alerts.map((alert) => (
                        <Alert key={alert.id} severity={alert.severity}>
                            {alert.message}
                        </Alert>
                    ))}
                </Stack>
            </Snackbar>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
