import {Plugin} from "../plugin"

export default class Hiworld extends Plugin {
    name = 'Hiworld'
    constructor(world: string) {
        super(world)
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Привет, ${this.world}!</p>`)
        })
    }
}