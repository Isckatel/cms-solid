export default class IoC {
    private static instances: { [key: string]: any } = {};

    static register(name: string, instance: any) {
        IoC.instances[name] = instance;
    }

    static resolve<T>(name: string): T {
        const instance = IoC.instances[name];
        if (!instance) {
            throw new Error(`Instance ${name} not found`);
        }
        return instance;
    }
}