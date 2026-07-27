export async function fetchWithAutoRefresh(
    url: string,
    options: RequestInit = {},
    accessToken: String | null,
    refreshToken: String | null,
    updateToken: (access: string, refresh: string) => void,
    logout: () => void
): Promise<Response> {
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(
            `http://localhost:8000/refresh?refresh_token=${refreshToken}`,
            {
                method: 'POST',
            }
        );

        if (refreshResponse.ok) {
            const data = await refreshResponse.json();

            updateToken(data.accesstoken, data.refreshtoken);
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${data.accesstoken}`,
                },
            });
        } else {
            logout();
            alert(' Session expired because inactivity, please login again');
        }
    }

    return response;
}
