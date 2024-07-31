import {IPlugin} from "../plugin"

export default class Hiworld implements IPlugin {
    name = 'Hiworld'
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