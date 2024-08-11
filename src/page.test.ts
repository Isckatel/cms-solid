const { JSDOM } = require('jsdom');
import { Page } from './page';
import Text from './plugins/text';
import { IPlugin } from './plugin';

// Создаем JSDOM документ
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
global.DOMParser = window.DOMParser;

describe('Page', () => {
    let page: Page;

    beforeEach(() => {
        page = new Page();
        jest.clearAllMocks();
    });

    test('должен добавлять и рендерить плагины', async () => {
        const mockReturningElement = '<div style="margin: 4px auto; width:800px;border: 2px solid #000;"><p style="margin: 4px">Съешь ещё этих мягких французских булок, да выпей чаю</p></div>';

        // Создаем мок текстового плагина
        const mockTextPlugin: IPlugin = new Text([
            'Съешь ещё этих мягких французских булок, да выпей чаю',
            '800px',
            '2px солидный #000',
        ]);

        // Мокаем метод render для плагина
        jest.spyOn(mockTextPlugin, 'render').mockImplementation(async () => mockReturningElement);

        // Добавляем плагин на страницу
        page.addPlugin(mockTextPlugin);

        // Рендерим страницу
        await page.render();

        // Проверка, что метод был вызван
        expect(mockTextPlugin.render).toHaveBeenCalled();

        const parsedDOM = new DOMParser().parseFromString(mockReturningElement, 'text/html');
        expect(parsedDOM.body.innerHTML).toContain('Съешь ещё этих мягких французских булок, да выпей чаю');
    });
});