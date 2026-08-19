import { useMutation } from '@tanstack/react-query';
import { getProtectedData } from '../../../api/authApi';
import { useAuth } from '../../../auth/useAuth';

export function useProtectedData() {
    const { accessToken, refreshToken, updateToken, logout } = useAuth();

    return useMutation({
        mutationFn: () =>
            getProtectedData({
                accessToken,
                refreshToken,
                updateToken,
                logout,
            }),
    });
}
