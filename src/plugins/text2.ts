import {IPlugin} from "../plugin"

export default class Text2 implements IPlugin {
    name = 'text2'
    parameterNames = ['Текст', 'Ширина блока(800px)', 'Стлиль границы (2px solid #000)']
    args = ['']
    constructor(args:string[]) {
        this.args = args
    }
    async render(): Promise<string> {
        const content = `<div style="margin: 4px auto; width:${this.args[1]};border: ${this.args[2]};">
            <p style="margin: 4px">${this.args[0]}</p>
        </div>`
        return new Promise((resolve, reject) => {
            resolve(content)
        })
    }
}