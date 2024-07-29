import IoC from "./ioc"
import { IPlugin, PluginManager } from "./plugin"
import { Page } from "./page"

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

//Загружаем список используемых плагинов и их параметров с "сервера"


const args1 = ['мир']
IoC.resolve('IoC.Register', ['hi1', () => new Plugin1(args1[0])])
const args2 = ['человек']
IoC.resolve('IoC.Register', ['hi2', () => new Plugin2(args2[0])])

PluginManager.loadPlugins()


const mainPage = new Page()
//TODO автоматическое добавление 
const plugin1: IPlugin = IoC.resolve('hi1', [])
const plugin2: IPlugin = IoC.resolve('hi2', [])
const hiworld: IPlugin = IoC.resolve('hiworld', [])
const byeman: IPlugin = IoC.resolve('byeman', [])
mainPage.addPlugin(plugin1)
mainPage.addPlugin(plugin2)
mainPage.addPlugin(hiworld)
mainPage.addPlugin(byeman)
mainPage.render()