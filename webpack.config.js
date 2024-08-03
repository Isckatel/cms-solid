import path from 'path';

const config = {
    mode: 'development', // Устанавливаем режим разработки
    entry: './src/index.ts', // Укажите начальную точку вашего приложения
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader', // Используйте ts-loader для компиляции TypeScript
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'], // Разрешаем расширения .ts и .js
    },
    output: {
        filename: 'index.js', // Имя выходного файла
        path: path.resolve(process.cwd(), 'publish'), // Папка для выходных файлов
    },
    devServer: {
        static: {
            directory: path.join(process.cwd(), 'publish'), // заменяем contentBase на static
        },
        compress: false,
        open: true, // автоматически открывать браузер
        hot: false, // включение горячей замены модулей (HMR)
        port: 9000 // Порт, на котором будет запущен сервер
    }
};

// Экспортируем конфигурацию как модуль
export default config;