import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: 'http://localhost:8000/api/',
    });

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('auth/profile/');
            setUser(res.data.user);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await api.post('auth/login/', { username, password });
        setToken(res.data.access);
        localStorage.setItem('access_token', res.data.access);
        if(res.data.refresh) localStorage.setItem('refresh_token', res.data.refresh);
        
        // Setup header and fetch user
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
        await fetchProfile();
        return true;
    };

    const register = async (username, email, password) => {
        const res = await api.post('auth/register/', { username, email, password });
        setToken(res.data.access);
        localStorage.setItem('access_token', res.data.access);
        setUser(res.data.user);
        return true;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, api }}>
            {children}
        </AuthContext.Provider>
    );
};
