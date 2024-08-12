import { IHttpService, IApiResponse } from "./httpService"
import IoC from "./ioc"
import { IPlugin, PluginManager, PluginObj, PluginsData } from "./plugin"

export class AdminPage {
    private httpService: IHttpService
    private plugins: Array<IPlugin> = []
    private pluginInfo: Array<PluginObj> = []

    constructor(httpService: IHttpService) {
        // Использование httpService
        this.httpService = httpService
    }

    async render() {

        await this.loadPlugins()

        // Создаем общую форму для всех плагинов
        const form = document.createElement('form')
        form.setAttribute('id', 'all-plugins-form')

        // Создаем поля для параметров каждого плагина
        for (const plugin of this.plugins) {
            const pluginFieldset = document.createElement('fieldset')
            pluginFieldset.setAttribute('id', `fieldset-${plugin.name}`)
            pluginFieldset.setAttribute('data-plugin-name', plugin.name)

            const legend = document.createElement('legend')
            legend.textContent = plugin.name
            pluginFieldset.appendChild(legend)

            const obj = this.pluginInfo.find(itm => itm.name === plugin.name)
            plugin.parameterNames.forEach((paramName, indx) => {
                const label = document.createElement('label')
                label.setAttribute('for', paramName)
                label.textContent = paramName

                const input = document.createElement('input')
                input.setAttribute('type', 'text')
                input.setAttribute('id', paramName)
                input.setAttribute('name', `${plugin.name}-${paramName}`)
                input.setAttribute('value', obj?.parametrs[indx] ?? '')

                pluginFieldset.appendChild(label)
                pluginFieldset.appendChild(input)
                pluginFieldset.appendChild(document.createElement('br')) // Добавляем перенос строки
            });

            form.appendChild(pluginFieldset)
        }

        // Добавляем кнопку для отправки формы
        const submitButton = document.createElement('button')
        submitButton.setAttribute('type', 'submit')
        submitButton.textContent = 'Сохранить параметры всех плагинов'

        const pluginFormsContainer = document.getElementById('plugin-forms')

        form.appendChild(submitButton)
        if (!pluginFormsContainer) return
        pluginFormsContainer.appendChild(form)
        
        this.addEvent()
    }

    //События обработки нажатия кнопок для отправки информации
    private addEvent() {
        const form = document.getElementById('all-plugins-form') as HTMLFormElement
        if (!form) return
        // Обработчик события на отправку формы
        form.addEventListener('submit', async (event) => {
            event.preventDefault()

            // Собираем данные формы
            const formData = new FormData(form);
            const pluginsParams: { name: string, parametrs: string[] }[] = []

            this.plugins.forEach(plugin => {
                const params: string[] = [];
                plugin.parameterNames.forEach(paramName => {
                    const value = formData.get(`${plugin.name}-${paramName}`)
                    if (value) {
                        params.push(value.toString())
                    }
                })
                pluginsParams.push({
                    name: plugin.name,
                    parametrs: params
                })
            })

            // Отправляем параметры на сервер
            this.httpService.post<any>('/api/plugins',{
                plugins: pluginsParams
            }).then((result: IApiResponse) => {
                alert(result.message)
            })
        })

        const pluginNameInput = document.getElementById('plugin-name') as HTMLInputElement
        const registryButton = document.getElementById('registry-button') as HTMLButtonElement

        registryButton.addEventListener('click', async (event) => {
            event.preventDefault()

            const pluginName = pluginNameInput.value

            if (!pluginName) {
                alert('Введите имя плагина!')
                return
            }

            // Отправляем параметры на сервер
            this.httpService.post<any>('/api/registration',{ name: pluginName })
                .then((result: IApiResponse) => {
                    alert(result.message)
                    pluginNameInput.value = ''
                 })
        })
    }

    private async loadPlugins() {
        // Ждем загрузки плагинов
        await PluginManager.loadPlugins()
        const pluginData: PluginsData = await PluginManager.loadPluginInfo()
        this.pluginInfo = pluginData.plugins

        //Получаем плагины на страницу
        const pluginsNameList: string[] = PluginManager.getPluginsNameList()
        for (const pluginName of pluginsNameList) {
            const plugin: IPlugin = IoC.resolve(pluginName, [])
            this.plugins.push(plugin)
        }
    }
}