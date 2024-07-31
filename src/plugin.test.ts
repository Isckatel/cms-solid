import { PluginManager } from "./plugin";

describe('PluginManager', () => {
    beforeEach(() => {
        // Сбросим список плагинов перед каждым тестом
        // Это нужно, чтобы обеспечить чистоту между тестами
        (PluginManager as any).pluginsList = [];
    });

    test('getPluginsList возвращает пустой массив, если плагины не загружены', () => {
        const pluginsList = PluginManager.getPluginsList();
        expect(pluginsList).toEqual([]);
    });

    // TODO следующие тесты
});