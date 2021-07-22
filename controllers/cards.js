const Card = require('../models/card');

const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({message: err.message}));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_VALIDATION).send({ message: 'Данные не прошли валидацию' });
      }
    else
      res.status(500).send({message: err.message});
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
    else
      res.status(200).send('Карточка удалена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id карточки' });
      }
    else
      res.status(500).send({message: err.message});
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Нет карточки по заданному id' });
      }
    else
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id карточки' });
      }
    else
      res.status(500).send({message: err.message});
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Нет карточки по заданному id' });
      }
    else
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_VALIDATION).send({ message: 'Невалидный id карточки' });
      }
    else
      res.status(500).send({message: err.message});
    });
};

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};
