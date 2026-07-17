import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';

interface ProtectedResponsse {
    message: string;
}

interface ErrorResponse {
    detail: string;
}

export default function Dashboard(): React.JSX.Element {
    const { token, logout } = useAuth();
    const [secretData, setSecretData] = useState<string>('');

    const fetchSecretData = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8000/protected', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                const successData = data as ProtectedResponsse;
                setSecretData(successData.message);
            } else {
                const errorData = data as ErrorResponse;
                setSecretData('Failed to fetch data: ' + errorData.detail);
            }
        } catch (err) {
            console.log('Error fetching secret data:', err);
            setSecretData('network error');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2> Dashboard (this is a private area)</h2>
            <button onClick={fetchSecretData}>Fetch Secret Data</button>
            {secretData && (
                <p style={{ fontWeight: 'bold', color: 'green' }}>
                    {' '}
                    {secretData}
                </p>
            )}
            <br />
            <button onClick={logout} style={{ marginTop: '20px' }}>
                Logout
            </button>
        </div>
    );
}
