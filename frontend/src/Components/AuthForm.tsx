import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as loginRequest, signUp, type Credentials } from '../api/authApi';
import { useAuth } from '../auth/useAuth';

export function AuthForm(): React.JSX.Element {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();

    const loginMutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            login(data.access_token, data.refresh_token);
            setMessage('Logged in successfully');
        },
        onError: (error) => setMessage(error.message),
    });
    const signUpMutation = useMutation({
        mutationFn: signUp,
        onSuccess: () => {
            setMessage('Registration successful! Please log in.');
            setIsLogin(true);
        },
        onError: (error) => setMessage(error.message),
    });
    const isPending = loginMutation.isPending || signUpMutation.isPending;

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setMessage('');
        const credentials: Credentials = { username, password };
        if (isLogin) loginMutation.mutate(credentials);
        else signUpMutation.mutate(credentials);
    };

    return (
        <div style={{ maxWidth: '300px', margin: '50px auto' }}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUsername(e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                </div>
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Submitting...' : isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button
                onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
                disabled={isPending}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'blue',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}
            >
                {isLogin
                    ? "Don't have an account? Sign Up"
                    : 'Already have an account? Login'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
