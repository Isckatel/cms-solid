import {IPlugin} from "../plugin"

export default class Hiworld implements IPlugin {
    name = 'Hiworld'
    word: string
    constructor(world: string) {
        this.word = world
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Привет, ${this.word}!</p>`)
        })
    }
}