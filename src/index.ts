import IoC from "./ioc"
import { IPlugin, PluginManager } from "./plugin"
import { Page } from "./page"

async function main() {

    // Ждем загрузки плагинов
    await PluginManager.loadPlugins()
    const mainPage = new Page()

    //Добавляем плагины на страницу
    const pluginsList: string[] = PluginManager.getPluginsList()
    for (const pluginName of pluginsList) {
        const plugin: IPlugin = IoC.resolve(pluginName, [])
        mainPage.addPlugin(plugin)
    }

    mainPage.render()
}

// Запуск основной функции
main().catch(error => {
    console.error('Произошла ошибка в основном процессе:', error)
})