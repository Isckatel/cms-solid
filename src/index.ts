import IoC from "./ioc"
import { IPlugin, PluginManager } from "./plugin"
import { Page } from "./page"
import { HttpService } from "./httpService"

async function main() {

    // Регистрация HttpService
    IoC.resolve('IoC.Register', ['HttpService', () => new HttpService()])
    PluginManager.init()

    // Ждем загрузки плагинов
    await PluginManager.loadPlugins()
    const mainPage = new Page()

    //Добавляем плагины на страницу
    const pluginsNameList: string[] = PluginManager.getPluginsNameList()
    for (const pluginName of pluginsNameList) {
        const plugin: IPlugin = IoC.resolve(pluginName, [])
        mainPage.addPlugin(plugin)
    }

    mainPage.render()
}

// Запуск основной функции
main().catch(error => {
    console.error('Произошла ошибка в основном процессе:', error)
})