const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const { OK, CREATED } = require('../utils/answers');

const getMovies = (req, res, next) => {
  const idCurrentUser = req.user._id;
  Movie.find({ owner: idCurrentUser })
    .then((movies) => res.status(OK).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: req.user,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const idCurrentUser = req.user._id;
  Movie.findById(id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Movie Not Found'));
      }
      if (movie.owner.toString() !== idCurrentUser) {
        return next(new ForbiddenError('The current user does not have the rights to delete this movie'));
      }
      return movie.deleteOne()
        .then(() => res.status(OK).send({ message: `Movie ${id} successfully delete` }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
