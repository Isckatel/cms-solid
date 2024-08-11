import IoC from "./ioc"
import { IHttpService } from './httpService'

export interface IPlugin {
    name: string
    parameterNames: string[]
    render(): Promise<string>
}

export type PluginObj = {
    name: string
    parametrs: string[]
}

export type PluginsData = {
    plugins: PluginObj[]
}

export class PluginManager {
    private static pluginsNameList: string[] = []
    private static httpService: IHttpService 

    static init() {
        PluginManager.httpService = IoC.resolve<IHttpService>('HttpService', [])
    }

    //Загрузка информации о плагине(имя, параметры) из источника
    static async loadPluginInfo(): Promise<PluginsData | any> {
        const plugins = await this.httpService.get<any[]>('/api/plugins')
        return plugins
    }

    //Добавление плагина в IoC контейнер
    static async registerPlugins(plugins: PluginsData) {
        for (const plugin of plugins.plugins) {
            try {
                const args = plugin.parametrs
                const pluginModule = await this.loadPlugin(plugin.name)
                const pluginClass = pluginModule.default

                IoC.resolve('IoC.Register', [plugin.name, () => new pluginClass(args)])
                PluginManager.pluginsNameList.push(plugin.name)
                console.log(`Плагин ${plugin.name} успешно зарегистрирован.`)
            } catch (error) {
                console.error(`Ошибка регистрации плагина ${plugin.name}: ${error}`)
            }
        }
    }

    //Непосредственная динамическая загрузка классов плагина из файла
    static async loadPlugin(pluginName: string): Promise<{ default: new (...args: any[]) => IPlugin }> {
        try {
            return await import(`./plugins/${pluginName}.ts`)
        } catch (error) {
            throw new Error(`Ошибка загрузки плагина ${pluginName}: ${error}`)
        }
    }

    //Загрузка всех плагинов о которых получена информация
    static async loadPlugins() {
        try {
            const pluginInfo = await this.loadPluginInfo()
            await this.registerPlugins(pluginInfo)
        } catch (error) {
            console.error('Ошибка в процессе загрузки плагинов:', error)
        }
    }

    //Получить имена загруженных плагинов
    static getPluginsList() {
        return PluginManager.pluginsNameList
    }
}