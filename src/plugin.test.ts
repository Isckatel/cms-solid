import { PluginManager } from "./plugin";
import IoC from "./ioc";

// Мокируем IoC контейнер
jest.mock("./ioc");  

describe('PluginManager', () => {
    beforeEach(() => {
        // Сбросим список плагинов перед каждым тестом
        (PluginManager as any).pluginsList = [];
    })

    test('getPluginsList возвращает пустой массив, если плагины не загружены', () => {
        const pluginsList = PluginManager.getPluginsList();
        expect(pluginsList).toEqual([]);
    })

    test('loadPluginInfo загружает информацию о плагинах', async () => {
        // Мокаем fetch для возвращения тестовых данных
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ plugins: [{ name: 'Byeman', parametrs: ['World'] }] }),
            })
        ) as jest.Mock;

        const result = await PluginManager.loadPluginInfo();
        expect(result).toEqual({ plugins: [{ name: 'Byeman', parametrs: ['World'] }] });
    })

    test('loadPluginInfo вызывает ошибку при недоступности сети', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network Error'))) as jest.Mock;

        await expect(PluginManager.loadPluginInfo()).rejects.toThrow('Network Error');
    });

    test('registerPlugins корректно регистрирует плагины', async () => {
        const mockPluginModule = {
            default: class {
                name = 'Byeman';
                world: string;
                constructor(world: string) {
                    this.world = world;
                }
                async render(): Promise<string> {
                    return `<p>Пока, ${this.world}!</p>`;
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
                world: string;
                constructor(world: string) {
                    this.world = world;
                }
                async render(): Promise<string> {
                    return `<p>Пока, ${this.world}!</p>`;
                }
            },
        };

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ plugins: [{ name: 'Byeman', parametrs: ['World'] }] }),
            })
        ) as jest.Mock;

        jest.spyOn(PluginManager, 'loadPlugin').mockResolvedValueOnce(mockPluginModule);
        const mockIoCRegister = jest.fn();
        (IoC.resolve as jest.Mock).mockImplementation((name: string, args: any[]) => {
            if (name === 'IoC.Register') {
                return mockIoCRegister();
            }
            return null;
        });

        await PluginManager.loadPlugins();

        expect(mockIoCRegister).toHaveBeenCalled();
        expect(PluginManager.getPluginsList()).toContain('Byeman');
    });
});