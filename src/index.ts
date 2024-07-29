import IoC from "./ioc"

interface IPlugin {
    name: string
    render(): Promise<string>
}

// Общий интерфейс для всех команд:
interface ICommand {
    execute(): Promise<string>
}

// Рендеринг плагина:
class RenderCommand implements ICommand {
    constructor(private plugin: IPlugin) {}

    async execute(): Promise<string> {
        return this.plugin.render()
    }
}

class Page {
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

    private getPlugin(name: string): IPlugin {
        // Получение плагина по имени с помощью DI
        try {
            return IoC.resolve(name, [])
        } catch (error) {
            throw new Error(`Plugin ${name} not found`)
        }
    }
}

class Plugin1 implements IPlugin {
    name = 'hi1'
    world: string
    constructor(world: string) {
        this.world = world
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Привет, ${this.world}!</p>`)
        })
    }
}

class Plugin2 implements IPlugin {
    name = 'hi2'
    world: string
    constructor(world: string) {
        this.world = world
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Пока, ${this.world}!</p>`)
        })
    }
}

const args1 = ['мир']
IoC.resolve('IoC.Register', ['hi1', () => new Plugin1(args1[0])])
const args2 = ['человек']
IoC.resolve('IoC.Register', ['hi2', () => new Plugin2(args2[0])])

const mainPage = new Page()
//TODO автоматическое добавление с помощью ? Page.getPlagin
const plugin1: IPlugin = IoC.resolve('hi1', [])
const plugin2: IPlugin = IoC.resolve('hi2', [])
mainPage.addPlugin(plugin1)
mainPage.addPlugin(plugin2)
mainPage.render()