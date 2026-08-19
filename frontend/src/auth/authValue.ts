import { createContext } from 'react';

export interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
    updateToken: (access: string, refresh: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
