import {Plugin} from "../plugin"

export default class Byeman extends Plugin {
    name = 'Byeman'
    constructor(world: string) {
        super(world)
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Пока, ${this.world}!</p>`)
        })
    }
}