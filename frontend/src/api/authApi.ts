const API_URL = 'http://localhost:8000';

export interface Credentials {
    username: string;
    password: string;
}
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}
export interface ProtectedResponse {
    message: string;
}
interface ErrorResponse {
    detail?: string;
}

export class ApiError extends Error {
    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, options);
    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
        throw new ApiError(
            (data as ErrorResponse | null)?.detail ?? 'Something went wrong',
            response.status
        );
    }
    return data as T;
}

export function login(credentials: Credentials): Promise<LoginResponse> {
    return request<LoginResponse>('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
}

export function signUp(credentials: Credentials): Promise<void> {
    return request<void>('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
}

interface AuthRequestOptions {
    accessToken: string | null;
    refreshToken: string | null;
    updateToken: (access: string, refresh: string) => void;
    logout: () => void;
}

export async function getProtectedData({
    accessToken,
    refreshToken,
    updateToken,
    logout,
}: AuthRequestOptions): Promise<ProtectedResponse> {
    try {
        return await request<ProtectedResponse>('/protected', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    } catch (error) {
        if (
            !(error instanceof ApiError) ||
            error.status !== 401 ||
            !refreshToken
        )
            throw error;
    }
    try {
        const tokens = await request<LoginResponse>(
            `/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
            { method: 'POST' }
        );
        updateToken(tokens.access_token, tokens.refresh_token);
        return await request<ProtectedResponse>('/protected', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
    } catch (error) {
        logout();
        throw error;
    }
}
