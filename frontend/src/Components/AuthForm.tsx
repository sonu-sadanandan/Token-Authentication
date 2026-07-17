import React, { useState } from 'react';
import { useAuth } from '../auth/authContext';

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface ErrorResponse {
    detail: string;
}

export function AuthForm(): React.JSX.Element {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/signup';

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorData = data as ErrorResponse;
                throw new Error(
                    errorData.detail || 'Something went wrong here'
                );
            }

            if (isLogin) {
                const loginData = data as LoginResponse;
                login(loginData.access_token);
                setMessage('Logged in Successfully');
            } else {
                setMessage('Registration successfull! Please login');
                setIsLogin(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage('An unknown error occurred');
            }
        }
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
                <button type="submit"> {isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <button
                onClick={() => setIsLogin(!isLogin)}
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
