import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

// Получение пути к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const PLUGIN_REGISTRY_PATH = path.join(__dirname, 'publish', 'plugin-registry.json');

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Обслуживание статических файлов из директории "publish"
app.use(express.static(path.join(__dirname, 'publish')));

// Получение информации о плагинах
app.get('/api/plugins', (req, res) => {
    fs.readFile(PLUGIN_REGISTRY_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }
        res.json(JSON.parse(data));
    });
});

// Сохранение информации о плагинах
app.post('/api/plugins', (req, res) => {
    const pluginsData = req.body;
    fs.writeFile(PLUGIN_REGISTRY_PATH, JSON.stringify(pluginsData, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка записи файла' });
        }
        res.json({ message: 'Данные успешно сохранены' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
