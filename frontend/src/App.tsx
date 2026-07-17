import React from 'react';
import { AuthProvider, useAuth } from './auth/authContext';
import { AuthForm } from './Components/AuthForm';
import Dashboard from './Components/Dashboard';

function AppContent(): React.JSX.Element {
    const { token } = useAuth();

    return token ? <Dashboard /> : <AuthForm />;
}
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
