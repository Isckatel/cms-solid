import { PluginManager } from "./plugin";
import IoC from "./ioc";
import { IHttpService } from './httpService';

// Мокируем IoC контейнер
jest.mock("./ioc");

describe('PluginManager', () => {
    let mockHttpService: jest.Mocked<IHttpService>;

    beforeEach(() => {
        // Сбросим список плагинов и создадим новый мок для httpService перед каждым тестом
        (PluginManager as any).pluginsList = [];
        
        mockHttpService = {
            get: jest.fn()
        } as unknown as jest.Mocked<IHttpService>;

        // Мокаем IoC чтобы возвращать наш mockHttpService
        (IoC.resolve as jest.Mock).mockImplementation((serviceName) => {
            if (serviceName === 'HttpService') {
                return mockHttpService;
            }
            return null;
        });

        PluginManager.init();
    });

    test('getPluginsList возвращает пустой массив, если плагины не загружены', () => {
        const pluginsList = PluginManager.getPluginsList();
        expect(pluginsList).toEqual([]);
    });

    test('loadPluginInfo загружает информацию о плагинах', async () => {
        const mockData = { plugins: [{ name: "picture", parametrs: ["https://egoshinweb.ru/img/galaxi.png"] }] };
        
        // Мокаем метод get у mockHttpService для возвращения тестовых данных
        mockHttpService.get.mockResolvedValueOnce(mockData);

        const result = await PluginManager.loadPluginInfo();
        expect(result).toEqual(mockData);
        expect(mockHttpService.get).toHaveBeenCalledWith('/api/plugins');
    });

    test('loadPluginInfo вызывает ошибку при недоступности сети', async () => {
        mockHttpService.get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(PluginManager.loadPluginInfo()).rejects.toThrow('Network Error');
    });

    test('registerPlugins корректно регистрирует плагины', async () => {
        const mockPluginModule = {
            default: class {
                name = 'Byeman';
                parameterNames = ['Текст']
                args = ['']
                constructor(args:string[]) {
                    this.args = args
                }
                async render(): Promise<string> {
                    return `<p>Пока, ${this.args[0]}!</p>`;
                }
            },
        };

        jest.spyOn(PluginManager, 'loadPlugin').mockResolvedValueOnce(mockPluginModule);
        const mockIoCRegister = jest.fn();
        (IoC.resolve as jest.Mock).mockImplementation((name: string, args: any[]) => {
            if (name === 'IoC.Register') {
                return mockIoCRegister();
            }
            return null;
        });

        const pluginsData = { plugins: [{ name: 'Byeman', parametrs: ['World'] }] };
        await PluginManager.registerPlugins(pluginsData);

        expect(mockIoCRegister).toHaveBeenCalled();
        expect(PluginManager.getPluginsList()).toContain('Byeman');
    });

    test('loadPlugins загружает и регистрирует плагины', async () => {
        const mockPluginModule = {
            default: class {
                name = 'Byeman';
                parameterNames = ['Текст']
                args = ['']
                constructor(args:string[]) {
                    this.args = args
                }
                async render(): Promise<string> {
                    return `<p>Пока, ${this.args[0]}!</p>`;
                }
            },
        };

        const mockData = { plugins: [{ name: 'Byeman', parametrs: ['World'] }] };
        
        mockHttpService.get.mockResolvedValueOnce(mockData);

        jest.spyOn(PluginManager, 'loadPlugin').mockResolvedValueOnce(mockPluginModule);
        const mockIoCRegister = jest.fn();
        (IoC.resolve as jest.Mock).mockImplementation((name: string, args: any[]) => {
            if (name === 'IoC.Register') {
                return mockIoCRegister();
            }
            return null;
        });

        await PluginManager.loadPlugins();

        expect(mockHttpService.get).toHaveBeenCalledWith('/api/plugins');
        expect(mockIoCRegister).toHaveBeenCalled();
        expect(PluginManager.getPluginsList()).toContain('Byeman');
    });
});