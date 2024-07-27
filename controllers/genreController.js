const Genre = require('../models/genre');
const Game = require('../models/game');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const genre = require('../models/genre');

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render('genre_list', {
    title: 'Genre List',
    genre_list: allGenres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, gamesInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, 'title description').exec(),
  ]);
  res.render('genre_detail', {
    title: 'Genre Detail',
    genre: genre,
    genre_games: gamesInGenre,
  });
});

exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  body('name', 'Genre must contain at least 3 characters').trim().isLength({ min: 3 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExists = await Genre.findOne({ name: req.body.nae })
        .collation({ locale: 'en', strength: 2 })
        .exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, genre_games] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, 'title description').exec(),
  ]);

  if (genre === null) {
    res.redirect('/inventory/genres');
  }
  res.render('genre_delete', {
    title: 'Delete Genre',
    genre: genre,
    genre_games: genre_games,
  });
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, genre_games] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, 'title description').exec(),
  ]);

  if (genre_games.length > 0) {
    res.render('genre_delete', {
      title: 'Delete Genre',
      genre: genre,
      genre_games: genre_games,
    });
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect('/inventory/genres');
  }
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    res.redirect('/inventory/genres');
  }

  res.render('genre_form', {
    title: 'Update Genre',
    genre: genre,
  });
});

exports.genre_update_post = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log('in here2');

    const newGenre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, newGenre, {});
      res.redirect(updatedGenre.url);
    }
  }),
];
