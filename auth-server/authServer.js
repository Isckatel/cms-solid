import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Эта часть будет содержать логику проверки имени пользователя и пароля
  if (username === 'admin' && password === 'password') {
    res.json({ token: 'sample-jwt-token' });
  } else {
    res.status(401).json({ message: 'Неверные учетные данные' });
  }
});

app.listen(3001, () => {
  console.log('Служба аутентификации, запущенная на порту 3001');
});