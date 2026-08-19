import React, { useState, type ReactNode } from 'react';
import { AuthContext } from './authValue';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem('accesstoken')
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        localStorage.getItem('refreshtoken')
    );

    const login = (access: string, refresh: string): void => {
        localStorage.setItem('accesstoken', access);
        localStorage.setItem('refreshtoken', refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
    };

    const updateToken = (access: string, refresh: string): void => {
        localStorage.setItem('accesstoken', access);
        localStorage.setItem('refreshtoken', refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
    };

    const logout = (): void => {
        localStorage.removeItem('accesstoken');
        localStorage.removeItem('refreshtoken');
        setAccessToken(null);
        setRefreshToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, login, logout, updateToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};
