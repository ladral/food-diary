import React, { useEffect } from "react";


const SilentCheckSsoRedirect: React.FC = () => {

    useEffect(() => {
        // Post the current URL to the parent window
        window.parent.postMessage(window.location.href, window.location.origin);
    }, []);

    return (
        <div>
        </div>
    );


};

export default SilentCheckSsoRedirect;