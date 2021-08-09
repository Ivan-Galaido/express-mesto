const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const UnauthorizedError = require('../errors/401-unauthorized-error');
const ForbiddenError = require('../errors/403-forbidden-error');

dotenv.config();
const { JWT_SECRET, NODE_ENV } = process.env;


  const token = req.cookies.userToken;
  let payload;

  try {
  // верифицируем токен
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
