# Используем актуальную версию Node.js, совпадающую с локальной
FROM node:22

WORKDIR /app

# Копируем файлы приложения
COPY . /app

# Удаляем папку node_modules, если она существует
RUN rm -fr node_modules

# Копируем package.json, чтобы установить зависимости
COPY package.json /app/package.json

# Устанавливаем зависимости
RUN npm install

# Открываем порт для приложения (Vite обычно использует 3000)
EXPOSE 5173

# Устанавливаем права на выполнение файла запуска
RUN chmod +x ./start_dev.sh

# Стартуем dev сервер
CMD ./start_dev.sh
