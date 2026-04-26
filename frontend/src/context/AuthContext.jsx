/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/').replace(/\/?$/, '/');

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);

    const api = useMemo(() => {
        const client = axios.create({ baseURL: API_BASE_URL });

        if (token) {
            client.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        return client;
    }, [token]);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }, []);

    const fetchProfile = useCallback(async () => {
        try {
            const res = await api.get('auth/profile/');
            setUser(res.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            logout();
        } finally {
            setLoading(false);
        }
    }, [api, logout]);

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [fetchProfile, token]);

    const login = useCallback(async (username, password) => {
        const res = await axios.post(`${API_BASE_URL}auth/login/`, { username, password });
        const accessToken = res.data.access_token ?? res.data.access;
        const refreshToken = res.data.refresh_token ?? res.data.refresh;

        if (!accessToken) {
            throw new Error('Missing access token in login response.');
        }

        setToken(accessToken);
        localStorage.setItem('access_token', accessToken);

        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }

        const profile = await axios.get(`${API_BASE_URL}auth/profile/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(profile.data);
        setLoading(false);
        return profile.data;
    }, []);

    const register = useCallback(async (username, email, password) => {
        const res = await axios.post(`${API_BASE_URL}auth/register/`, { username, email, password });
        const accessToken = res.data.access_token ?? res.data.access;
        const refreshToken = res.data.refresh_token ?? res.data.refresh;

        if (!accessToken) {
            throw new Error('Missing access token in registration response.');
        }

        setToken(accessToken);
        localStorage.setItem('access_token', accessToken);

        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }

        setUser(res.data.user);
        setLoading(false);
        return res.data.user;
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        loading,
        login,
        register,
        logout,
        api,
    }), [api, loading, login, logout, register, token, user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
