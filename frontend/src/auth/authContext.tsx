import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

interface AuthContextType {
    accessToken: String | null;
    refreshToken: String | null;
    login: (access: string, refresh: string) => void;
    logout: () => void;
    updateToken: (access: string, refresh: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<String | null>(
        localStorage.getItem('accesstoken')
    );
    const [refreshToken, setRefreshToken] = useState<String | null>(
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
