import IoC from "./ioc"

export interface IPlugin {
    name: string
    render(): Promise<string>
}

type PluginObj = {
    name: string
    parametrs: string[]
}

type PluginsData = {
    plugins: PluginObj[]
}

export class PluginManager {
    private static pluginsList: string[] = []

    //Загрузка информации о плагине(имя, параметры) из источника (файл, сервер)
    static async loadPluginInfo(): Promise<PluginsData | any> {
        try {
            const response = await fetch('/api/plugins');
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data.plugins);
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке информации о плагинах:', error);
            throw error;
        }
    }

    //Добавление плагина в IoC контейнер
    static async registerPlugins(plugins: PluginsData) {
        for (const plugin of plugins.plugins) {
            try {
                const args = plugin.parametrs
                const pluginModule = await this.loadPlugin(plugin.name)
                const pluginClass = pluginModule.default

                IoC.resolve('IoC.Register', [plugin.name, () => new pluginClass(args)])
                PluginManager.pluginsList.push(plugin.name)
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
        return PluginManager.pluginsList
    }
}