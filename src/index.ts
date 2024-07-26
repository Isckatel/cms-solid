import IoC from "./ioc"

interface IPlugin {
    name: string
    render(): Promise<string>
}

//Компонент страницы:
class Component {
    constructor(public name: string, public params: object) {}
}

//Общий интерфейс для всех команд:
interface ICommand {
    execute(): Promise<string>
}

//Рендеринг компонента:
class RenderCommand implements ICommand {
    constructor(private plugin: IPlugin) {}

    async execute(): Promise<string> {
        return this.plugin.render()
  }
}

class Page {
    private components: Component[] = [];

    addComponent(component: Component) {
        this.components.push(component)
    }

    async render(): Promise<void> {
        const bodyElement = document.querySelector('body')
        const parser = new DOMParser()

        for (const component of this.components) {
            const plugin = this.getPlugin(component.name)
            const command = new RenderCommand(plugin)
            
            // Выполняем команды, но не дожидаемся завершения
            command.execute().then(result => {
                if (bodyElement) {
                    const doc = parser.parseFromString(result, "text/html")
                    const element = doc.body.firstChild;
                    if(element) {
                        bodyElement.appendChild(element)
                    } else {
                        console.log("Нет контента в компоненте или это не HTML-элемент")
                    }
                }
            });
        }
    }

    private getPlugin(name: string): IPlugin {
      // TODO здесь нужно использовать DI для получения плагина по имени
      switch (name) {
        case 'hi1':
            return new Plugin1()
        case 'hi2':
            return new Plugin2()
        // ...
        default:
            throw new Error(`Plugin ${name} not found`)
      }
    }
}

class Plugin1 implements IPlugin {
    name = 'hi1'
    async render(): Promise<string> {
      return new Promise((resolve, reject) => {
        resolve("<p>Привет, мир!</p>")
      })
    }
}

class Plugin2 implements IPlugin {
    name = 'hi2'
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve("<p>Привет, пользователь!</p>")
        })
    }
}

const mainPage = new Page()
const hi1 = new Component('hi1', {})
const hi2 = new Component('hi2', {})
mainPage.addComponent(hi1)
mainPage.addComponent(hi2)
mainPage.render();