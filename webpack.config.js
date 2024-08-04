import path from 'path';

const config = {
    mode: 'development', // Устанавливаем режим разработки
    entry: {
        index: './src/index.ts', // Начальная точка для основного приложения
        admin: './src/admin.ts'  // Начальная точка для административной страницы
    },
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
        filename: '[name].js', // Имя выходного файла будет зависеть от имени точки входа
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