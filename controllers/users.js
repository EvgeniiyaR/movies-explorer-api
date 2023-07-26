const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const { OK, CREATED } = require('../utils/answers');
const { NOT_UNIQE } = require('../utils/errors');

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Not Found'));
      }
      return res.status(OK).send({ name: user.name, email: user.email });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(CREATED).send(
      {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
      },
    ))
    .catch((err) => {
      if (err.code === NOT_UNIQE) {
        return next(new ConflictError('The user already exists'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Not Found'));
      }
      return res.status(OK).send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.code === NOT_UNIQE) {
        return next(new ConflictError('The email already exists'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('The user does not exist'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Wrong email or password'));
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });

          return res.status(OK).send({ message: `User ${user.email} successfully logged in` });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const deleteCookies = (req, res) => {
  res.status(OK).clearCookie('jwt').send({ message: 'Cookies removed' });
};

module.exports = {
  createUser,
  updateUser,
  login,
  getCurrentUser,
  deleteCookies,
};
