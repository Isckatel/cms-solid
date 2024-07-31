import {IPlugin} from "../plugin"

export default class Byeman implements IPlugin {
    name = 'Byeman'
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