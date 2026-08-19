import { useState, type FormEvent } from 'react';
import { PageContainer } from '../../Components/layout/PageContainer';
import { StatusMessage } from '../../Components/ui/StatusMessage';
import { useAuth } from '../../auth/useAuth';
import {
    AuthCredentialsForm,
    type AuthCredentials,
} from './components/AuthCredentialsForm';
import { AuthModeToggle } from './components/AuthModeToggle';
import { useAuthMutations } from './hooks/useAuthMutations';

export function AuthScreen(): React.JSX.Element {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState<AuthCredentials>({
        username: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const { submit, isSubmitting } = useAuthMutations({
        onLoginSuccess: (tokens) => {
            login(tokens.access_token, tokens.refresh_token);
            setMessage('Logged in successfully');
        },
        onSignUpSuccess: () => {
            setMessage('Registration successful! Please log in.');
            setIsLogin(true);
        },
        onError: (error) => setMessage(error.message),
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setMessage('');
        submit(isLogin, credentials);
    };

    const toggleMode = (): void => {
        setIsLogin((current) => !current);
        setMessage('');
    };

    return (
        <PageContainer>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <AuthCredentialsForm
                credentials={credentials}
                isLogin={isLogin}
                isSubmitting={isSubmitting}
                onCredentialsChange={setCredentials}
                onSubmit={handleSubmit}
            />
            <AuthModeToggle
                isLogin={isLogin}
                disabled={isSubmitting}
                onToggle={toggleMode}
            />
            {message && <StatusMessage>{message}</StatusMessage>}
        </PageContainer>
    );
}
