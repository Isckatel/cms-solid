import {IPlugin} from "../plugin"

export default class Picture implements IPlugin {
    name = 'Picture'
    args = ['']
    constructor(args:string[]) {
        this.args = args
    }
    async render(): Promise<string> {
        const content = `<div style="width: 800px; text-align: center;">
            <img src="${this.args[0]}"></img>
        </div>`
        return new Promise((resolve, reject) => {
            resolve(content)
        })
    }
}