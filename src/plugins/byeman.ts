import {IPlugin} from "../plugin"

export default class Byeman implements IPlugin {
    name = 'Byeman'
    word: string
    constructor(world: string) {
        this.word = world
    }
    async render(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(`<p>Пока, ${this.word}!</p>`)
        })
    }
}