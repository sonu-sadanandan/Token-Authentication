import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

interface AuthContextType {
    token: String | null;
    login: (newToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<String | null>(
        localStorage.getItem('token')
    );

    const login = (newToken: string): void => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
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
