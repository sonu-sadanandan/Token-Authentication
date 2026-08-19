import { useMutation } from '@tanstack/react-query';
import {
    login,
    signUp,
    type Credentials,
    type LoginResponse,
} from '../../../api/authApi';

interface UseAuthMutationsOptions {
    onLoginSuccess: (tokens: LoginResponse) => void;
    onSignUpSuccess: () => void;
    onError: (error: Error) => void;
}

export function useAuthMutations({
    onLoginSuccess,
    onSignUpSuccess,
    onError,
}: UseAuthMutationsOptions) {
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: onLoginSuccess,
        onError,
    });
    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: onSignUpSuccess,
        onError,
    });

    const submit = (isLogin: boolean, credentials: Credentials): void => {
        if (isLogin) loginMutation.mutate(credentials);
        else signUpMutation.mutate(credentials);
    };

    return {
        submit,
        isSubmitting: loginMutation.isPending || signUpMutation.isPending,
    };
}
