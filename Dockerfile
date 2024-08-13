# Используем базовый образ Node.js
FROM node:20

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в рабочую директорию внутри контейнера
COPY . .

# Собираем проект
RUN npm run build

# Открываем необходимые порты
EXPOSE 3000

# Команда по умолчанию для запуска сервера
CMD ["npm", "run", "start-server"]