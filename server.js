import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Получение пути к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PLUGIN_REGISTRY_PATH = path.join(__dirname, 'publish', 'plugin-registry.json');

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Middleware для парсинга куки
app.use(cookieParser());

// Middleware для проверки токена
const authenticate = async (req, res, next) => {
    const token = req.cookies.authorization;
    try {
      await axios.post('http://auth:3001/verify', {}, {
        headers: { 'authorization': token },
      });
      console.log('Прошла верификация')
      next();
    } catch (error) {
        console.log('Верификация не прошла')
        res.redirect('/login.html')
    }
};

// Редирект на авторизацию при доступе к admin.html
app.get('/admin.html', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, '/publish/admin.html'));
});

// Сохранение информации о плагинах
app.post('/api/plugins', authenticate, (req, res) => {
    const pluginsData = req.body;
    fs.writeFile(PLUGIN_REGISTRY_PATH, JSON.stringify(pluginsData, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка записи файла' });
        }
        res.json({ message: 'Данные успешно сохранены' });
    });
});

// Обслуживание статических файлов из директории "publish"
app.use(express.static(path.join(__dirname, 'publish')));

app.post('/api/login', async (req, res) => {
    try {
      const response = await axios.post('http://auth:3001/login', {
        username: req.body.username,
        password: req.body.password,
      });
      console.log(response.data);
      res.cookie('authorization', response.data.authorization, { 
        httpOnly: true,   // Кука не доступна через JavaScript 
        sameSite: 'strict' // Защита от CSRF атак
      });
      res.send({ message: 'Успешная аутентификация' });
    } catch (error) {
      console.log(error)
      res.status(401).json({ message: 'Неверные учетные данные' });
    }
  });

// Получение информации о плагинах
app.get('/api/plugins', (req, res) => {
    fs.readFile(PLUGIN_REGISTRY_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        res.json(JSON.parse(data));
    });
});

// Регистрация плагина
app.post('/api/registration', (req, res) => {
    const pluginName = req.body.name;

    if (!pluginName) {
        return res.status(400).json({ error: 'Имя плагина не указано' });
    }

    //Чтение файла
    fs.readFile(PLUGIN_REGISTRY_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        let pluginsData;

        try {
            pluginsData = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Ошибка синтаксиса JSON' });
        }

        const newPlugin = {
            name: pluginName,
            parametrs: []
        };

        pluginsData.plugins.push(newPlugin);

        // Запись
        fs.writeFile(PLUGIN_REGISTRY_PATH, JSON.stringify(pluginsData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Ошибка записи файла' });
            }

            res.json({ message: 'Плагин успешно добавлен' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
