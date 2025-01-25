import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null); // Initialize with null

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('/api/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(res.data.user);
                }
            } catch (error) {
              localStorage.removeItem('token')
                console.error("Auth check error:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
        } catch (error) {
            throw error; // Re-throw the error to be handled in the component
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const contextValue = { user, login, logout, loading };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;