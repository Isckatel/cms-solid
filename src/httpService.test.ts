import { HttpService, IHttpService } from './httpService';

describe('HttpService', () => {
    let httpService: IHttpService;

    beforeEach(() => {
        // Сброс моков перед каждым тестом
        jest.resetAllMocks();
        httpService = new HttpService();
    });

    test('GET запрос работает правильно', async () => {
        const mockResponse = {
            plugins: [
                {
                    name: "text",
                    parametrs: [
                        "Съешь ещё этих мягких французских булок, да выпей чаю",
                        "800px",
                        "2px solid #000"
                    ]
                }
            ]
        };

        // Мокаем fetch для возвращения тестовых данных
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const url = 'http://example.com/api/plugins';
        const response = await httpService.get<{ message: string }>(url);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(url);
        expect(response).toEqual(mockResponse);
    });

    test('POST запрос работает правильно', async () => {
        const mockResponse = { message: 'Hello POST' };

        // Мокаем fetch для возвращения тестовых данных
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            })
        ) as jest.Mock;

        const url = 'http://example.com/api/plugins';
        const body = { name: 'text' };
        const response = await httpService.post<{ message: string }>(url, body);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(mockResponse);
    });
});