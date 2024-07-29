import IoC from "./ioc";

export interface IPlugin {
    name: string
    render(): Promise<string>
}
//TODO возможно стоит убрать и просто плагины наследовать от интерфейса
export class Plugin implements IPlugin {
    name = 'plugin'
    world: string
    constructor(world: string) {
        this.world = world
    }
    render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Привет, ${this.world}!</p>`)
        })
    }
}

type PluginObj = {
    name: string;
    parametrs: string[];
};

type PluginsData = {
    plugins: PluginObj[];
};

export class PluginManager {
    static async loadPluginInfo(): Promise<PluginsData | any> { 
        // TODO добавить обработку ошибок
        const response = await fetch('plugin-registry.json');
        const data = await response.json();
        console.log(data.plugins);
        return data; 
    }

    static async registerPlugins(plugins: PluginsData) {
        for (const plugin of plugins.plugins) {
            try {
                const args = plugin.parametrs;
                const pluginModule = await this.loadPlugin(plugin.name);
                const pluginClass = pluginModule.default; // Предположим, что класс экспортируется по умолчанию

                IoC.resolve('IoC.Register', [plugin.name, () => new pluginClass(args[0])]);
            } catch (error) {
                throw new Error(`Plugin ${plugin.name} not found: ${error}`);
            }
        }
    }

    static async loadPlugin(pluginName: string): Promise<{ default: new (...args: any[]) => IPlugin }> {
        return await import(`./plugins/${pluginName}.ts`); 
    }

    static async loadPlugins() {
        const pluginInfo = await this.loadPluginInfo()
        this.registerPlugins(pluginInfo);
    }
}