import type { FormEvent } from 'react';
import { FormField } from '../../../Components/ui/FormField';

export interface AuthCredentials {
    username: string;
    password: string;
}

interface AuthCredentialsFormProps {
    credentials: AuthCredentials;
    isLogin: boolean;
    isSubmitting: boolean;
    onCredentialsChange: (credentials: AuthCredentials) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AuthCredentialsForm({
    credentials,
    isLogin,
    isSubmitting,
    onCredentialsChange,
    onSubmit,
}: AuthCredentialsFormProps): React.JSX.Element {
    return (
        <form onSubmit={onSubmit}>
            <FormField
                id="username"
                label="Username"
                value={credentials.username}
                disabled={isSubmitting}
                onChange={(username) =>
                    onCredentialsChange({ ...credentials, username })
                }
            />
            <FormField
                id="password"
                label="Password"
                type="password"
                value={credentials.password}
                disabled={isSubmitting}
                onChange={(password) =>
                    onCredentialsChange({ ...credentials, password })
                }
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
        </form>
    );
}
