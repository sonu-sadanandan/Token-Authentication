import React from 'react';
import { AuthProvider } from './auth/authContext';
import { useAuth } from './auth/useAuth';
import { AuthForm } from './Components/AuthForm';
import { Dashboard } from './Components/Dashboard';

function AppContent(): React.JSX.Element {
    const { accessToken } = useAuth();

    return accessToken ? <Dashboard /> : <AuthForm />;
}
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
