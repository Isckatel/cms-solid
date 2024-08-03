import IoC from "./ioc" // Импортируем класс IoC

// Создаем заглушку для плагина Hiworld
class MockHiworld {
    constructor(public word: string) {}
}

describe('IoC', () => {
    beforeEach(() => {
        // Сбрасываем список экземпляров перед каждым тестом
        (IoC as any).instances = {}
    });

    test('resolve возвращает зарегистрированный экземпляр Hiworld', () => {
        const pluginName = 'Hiworld';
        const word = 'мир'
        IoC.resolve('IoC.Register', [pluginName, () => new MockHiworld(word)]); // Регистрируем экземпляр
        
        const instance = IoC.resolve(pluginName, []); // Разрешаем экземпляр
        expect(instance).toBeInstanceOf(MockHiworld); // Проверяем, что это экземпляр MockHiworld
    })

    test('resolve выбрасывает ошибку, если экземпляр не найден', () => {
        expect(() => IoC.resolve('NonExistentInstance', [])).toThrow('Instance NonExistentInstance not found')
    })
});