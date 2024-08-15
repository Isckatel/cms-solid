# Используем базовый образ Node.js
FROM node:20

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем весь проект
COPY . .

# Открываем необходимые порты
EXPOSE 3001

# Команда для запуска сервера
CMD ["npm", "run", "start"]