interface FetchOptions {
    method?: 'GET' | 'POST';
    headers?: { [header: string]: string };
    data?: any;
}

export async function fetch (
    path: string,
    options?: FetchOptions,
): Promise<any> {
    const nativeOptions: any = {
        method: options?.method || 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: options?.data && JSON.stringify(options.data),
    };

    try {
        const rawResponse = await globalThis.fetch(path, nativeOptions);
        return await rawResponse.json();
    } catch (error) {
        return null;
    }
}
