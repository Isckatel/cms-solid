import { AdminPage } from "./adminPage";
import { HttpService, IHttpService } from "./httpService";
import IoC from "./ioc";
import { PluginManager } from "./plugin"

// Регистрация HttpService
IoC.resolve('IoC.Register', ['HttpService', () => new HttpService()])
PluginManager.init()

// Инициализация страницы администратора
const adminPage = new AdminPage(IoC.resolve<IHttpService>('HttpService', []));
adminPage.render();