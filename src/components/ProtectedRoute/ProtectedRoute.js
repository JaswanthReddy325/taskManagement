import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const ProtectedRoute = ({ children }) => { // Use children prop
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />; // Use Navigate
    }

    return children; // Render the children
};

export default ProtectedRoute;
