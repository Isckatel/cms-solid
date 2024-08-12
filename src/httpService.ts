export interface IHttpService {
    get<T>(url: string): Promise<T>
    post<T>(url: string, body: any): Promise<T>
}

export interface IApiResponse {
    message: string
}

export class HttpService implements IHttpService {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`GET запрос на ${url} не удался со статусом ${response.status}`)
        }
        return response.json()
    }

    async post<T>(url: string, body: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`POST запрос на ${url} не удался со статусом ${response.status}`);
        }
        return response.json()
    }
}