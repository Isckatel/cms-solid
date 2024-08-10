import { IHttpService } from "./httpService";
import IoC from "./ioc";
import { IPlugin, PluginManager, PluginsData } from "./plugin";

export class AdminPage {
    private httpService: IHttpService 
    constructor(httpService: IHttpService) {
        // Использование httpService
        this.httpService = httpService;
    }
    async render() {
        // Ждем загрузки плагинов
        await PluginManager.loadPlugins()
        const pluginData: PluginsData = await PluginManager.loadPluginInfo()
        const pluginInfo = pluginData.plugins
        console.log(pluginInfo)
        //Почить загруженные плагины
        const pluginFormsContainer = document.getElementById('plugin-forms');

        //Получаем плагины на страницу
        let plugins: Array<IPlugin> = [];
        const pluginsList: string[] = PluginManager.getPluginsList()
        for (const pluginName of pluginsList) {
            const plugin: IPlugin = IoC.resolve(pluginName, [])
            plugins.push(plugin)
        }

        // Создаем общую форму для всех плагинов
        const form = document.createElement('form');
        form.setAttribute('id', 'all-plugins-form');

        // Создаем поля для параметров каждого плагина
        for (const plugin of plugins) {
            const pluginFieldset = document.createElement('fieldset');
            pluginFieldset.setAttribute('id', `fieldset-${plugin.name}`);
            pluginFieldset.setAttribute('data-plugin-name', plugin.name);

            const legend = document.createElement('legend');
            legend.textContent = plugin.name;
            pluginFieldset.appendChild(legend);

            const obj = pluginInfo.find(itm => itm.name === plugin.name);
            plugin.parameterNames.forEach((paramName, indx) => {
                const label = document.createElement('label');
                label.setAttribute('for', paramName);
                label.textContent = paramName;

                const input = document.createElement('input');
                input.setAttribute('type', 'text');
                input.setAttribute('id', paramName);
                input.setAttribute('name', `${plugin.name}-${paramName}`);
                input.setAttribute('value', obj?.parametrs[indx] ?? '')

                pluginFieldset.appendChild(label);
                pluginFieldset.appendChild(input);
                pluginFieldset.appendChild(document.createElement('br')); // Добавляем перенос строки
            });

            form.appendChild(pluginFieldset);
        }

        // Добавляем кнопку для отправки формы
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Сохранить параметры всех плагинов';

        form.appendChild(submitButton);
        if (!pluginFormsContainer) return
        pluginFormsContainer.appendChild(form);

        // Обработчик события на отправку формы
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Предотвращаем стандартное поведение формы

            // Собираем данные формы
            const formData = new FormData(form);
            const pluginsParams: { name: string, parametrs: string[] }[] = [];

            plugins.forEach(plugin => {
                const params: string[] = [];
                plugin.parameterNames.forEach(paramName => {
                    const value = formData.get(`${plugin.name}-${paramName}`);
                    if (value) {
                        params.push(value.toString());
                    }
                });
                pluginsParams.push({
                    name: plugin.name,
                    parametrs: params
                });
            });

            // Отправляем параметры на сервер
            //TODO сообщение об успехе и удалить поле
            this.httpService.post<any[]>('/api/plugins',{
                plugins: pluginsParams
            })
        });

        const pluginNameInput = document.getElementById('plugin-name') as HTMLInputElement;
        const registryButton = document.getElementById('registry-button') as HTMLButtonElement;

        registryButton.addEventListener('click', async (event) => {
            event.preventDefault();

            const pluginName = pluginNameInput.value

            if (!pluginName) {
                alert('Введите имя плагина!')
                return
            }

            // Отправляем параметры на сервер
            //TODO сообщение об успехе и удалить поле
            this.httpService.post<any[]>('/api/registration',{ name: pluginName })
        });
    }
}