export default class IoC {
    private static instances: { [key: string]: any } = {}

    static resolve<T>(name: string, args: any[]): T {
        const endArg = args[args.length - 1]
        if (name === 'IoC.Register' && typeof endArg === 'function') {
            //регистрируем
            IoC.instances[args[0]] = endArg()
            return  IoC.instances[args[0]]
        } else if(name === 'IoC.Register' && typeof endArg !== 'function') {
            throw new Error('Аргументом должна быть функция')
        } else {
            const instance = IoC.instances[name]
            if (!instance) {
                throw new Error(`Экземпляр ${name} не найден`)
            }
            return instance
        }
    }
}