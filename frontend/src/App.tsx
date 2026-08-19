import React from 'react';
import { AuthProvider } from './auth/authContext';
import { useAuth } from './auth/useAuth';
import { AuthScreen } from './features/auth/AuthScreen';
import { DashboardScreen } from './features/dashboard/DashboardScreen';

function AppContent(): React.JSX.Element {
    const { accessToken } = useAuth();

    return accessToken ? <DashboardScreen /> : <AuthScreen />;
}
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
