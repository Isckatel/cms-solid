import { IPlugin } from "./plugin"

// Общий интерфейс для всех команд:
export interface ICommand {
    execute(): Promise<string>
}

// Рендеринг плагина:
class RenderCommand implements ICommand {
    constructor(private plugin: IPlugin) {}

    async execute(): Promise<string> {
        return this.plugin.render()
    }
}

export class Page {
    private plugins: IPlugin[] = []

    addPlugin(plugin: IPlugin) {
        this.plugins.push(plugin)
    }

    async render(): Promise<void> {
        const bodyElement = document.querySelector('body');
        const parser = new DOMParser()

        for (const plugin of this.plugins) {
            const command = new RenderCommand(plugin);

            // Выполняем команды, но не дожидаемся завершения
            command.execute().then(result => {
                if (bodyElement) {
                    const doc = parser.parseFromString(result, "text/html");
                    const element = doc.body.firstChild;
                    if (element) {
                        bodyElement.appendChild(element);
                    } else {
                        console.log("Нет контента в плагине или это не HTML-элемент");
                    }
                }
            });
        }
    }
    //TODO пока не понял где лучше это делать
    // private getPlugin(name: string): IPlugin {
    //     // Получение плагина по имени с помощью DI
    //     try {
    //         return IoC.resolve(name, [])
    //     } catch (error) {
    //         throw new Error(`Plugin ${name} not found`)
    //     }
    // }
}