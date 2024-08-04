import {IPlugin} from "../plugin"

export default class Picture implements IPlugin {
    name = 'picture'
    parameterNames = ['URL адрес картинки']
    args = ['']
    constructor(args:string[]) {
        this.args = args
    }
    async render(): Promise<string> {
        const content = `<div 
            style="
                width: 800px;
                height: 720px;
                margin: 4px auto;
                background: url(${this.args[0]}) no-repeat center;
                background-size: 100% auto">
        </div>`
        return new Promise((resolve, reject) => {
            resolve(content)
        })
    }
}