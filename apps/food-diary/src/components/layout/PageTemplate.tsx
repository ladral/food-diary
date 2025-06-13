import React from "react";
import useKeycloak from "../../hooks/useKeycloak.ts";
import Header from "./Header.tsx";
import Navigation from "./Navigation.tsx";
import Footer from "./Footer.tsx";

interface PageTemplateProps {
    children: React.ReactNode;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
    const { authenticated } = useKeycloak();

    return (
        <div className="page u-h-100-vh is-flex is-flex-direction-column">
            {authenticated && <Header />}
            <div className="is-flex-grow-1 is-flex is-flex-direction-column u-overflow-auto">
                <div className="is-flex is-flex-grow-1 is-flex-direction-row u-overflow-auto">
                    {authenticated && (
                        <aside className="sidebar">
                            <Navigation />
                        </aside>
                    )}
                    {authenticated && (
                        <div className="container px-4 u-w-100">
                            {children}
                        </div>
                    )}
                </div>
                {authenticated && <Footer />}
            </div>
        </div>
    );
}

export default PageTemplate;
