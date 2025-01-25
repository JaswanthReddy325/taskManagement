import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./index.css";
import Home from "./components/Home";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider> {/* Wrap with AuthProvider */}
                <Routes> {/* Use Routes */}
                    {/* Default Route: Redirect '/' to '/login' */}
                    <Route path="/" element={<Navigate to="/login" />} /> {/* Use Navigate */}

                    {/* Login Page Route */}
                    <Route path="/login" element={<Login />} /> {/* Use element */}

                    {/* Protected Home Page Route */}
                    <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                    {/* Catch-all Route for Invalid URLs */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;