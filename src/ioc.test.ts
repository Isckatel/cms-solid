import IoC from "./ioc";
import { IPlugin } from "./plugin";

// Создаем заглушку для плагина Text
class MockText implements IPlugin {
    name = 'text';
    parameterNames = ['Текст', 'Ширина блока(800px)', 'Стиль границы (2px solid #000)'];
    args = [''];
    
    constructor(args: string[]) {
        this.args = args;
    }

    async render(): Promise<string> {
        const content = `
            <div style="margin: 4px auto; width:${this.args[1]};border: ${this.args[2]};">
                <p style="margin: 4px">${this.args[0]}</p>
            </div>
        `;
        return Promise.resolve(content);
    }
}

describe('IoC', () => {
    beforeEach(() => {
        // Сбрасываем список экземпляров перед каждым тестом
        (IoC as any).instances = {};
    });

    test('resolve возвращает зарегистрированный экземпляр Text', async () => {
        const pluginName = 'text';
        const args = [
            "Съешь ещё этих мягких французских булок, да выпей чаю",
            "800px",
            "2px solid #000"
        ];
        IoC.resolve('IoC.Register', [pluginName, () => new MockText(args)]); // Регистрируем экземпляр
        
        const instance = IoC.resolve(pluginName, []); 
        expect(instance).toBeInstanceOf(MockText); // Проверяем, что это экземпляр MockText
    });

    test('resolve возвращает тот же экземпляр при повторном обращении', () => {
        const pluginName = 'text';
        const args = [
            "Съешь ещё этих мягких французских булок, да выпей чаю",
            "800px",
            "2px solid #000"
        ];
        IoC.resolve('IoC.Register', [pluginName, () => new MockText(args)]); // Регистрируем экземпляр
        
        const instance1 = IoC.resolve(pluginName, []); // Разрешаем экземпляр первый раз
        const instance2 = IoC.resolve(pluginName, []); // Разрешаем экземпляр второй раз

        expect(instance1).toBe(instance2); // Проверяем, что это один и тот же экземпляр
    });

    test('resolve выбрасывает ошибку, если экземпляр не найден', () => {
        expect(() => IoC.resolve('NonExistentInstance', [])).toThrow('Экземпляр NonExistentInstance не найден');
    });

    test('resolve выбрасывает ошибку, если аргумент не является функцией', () => {
        expect(() => IoC.resolve('IoC.Register', ['InvalidPlugin', {} as any])).toThrow('Аргументом должна быть функция');
    });
});