import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../auth/useAuth';
import { getProtectedData } from '../api/authApi';

export function Dashboard(): React.JSX.Element {
    const { accessToken, refreshToken, updateToken, logout } = useAuth();
    const secretDataMutation = useMutation({
        mutationFn: () => getProtectedData({ accessToken, refreshToken, updateToken, logout }),
    });

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Dashboard (this is a private area)</h2>
            <button onClick={() => secretDataMutation.mutate()} disabled={secretDataMutation.isPending}>
                {secretDataMutation.isPending ? 'Loading...' : 'Fetch Secret Data'}
            </button>
            {secretDataMutation.data && (
                <p style={{ fontWeight: 'bold', color: 'green' }}>
                    {secretDataMutation.data.message}
                </p>
            )}
            {secretDataMutation.isError && (
                <p style={{ fontWeight: 'bold', color: 'crimson' }}>
                    Failed to fetch data: {secretDataMutation.error.message}
                </p>
            )}
            <br />
            <button onClick={logout} style={{ marginTop: '20px' }}>
                Logout
            </button>
        </div>
    );
}
