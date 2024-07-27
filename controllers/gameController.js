const Game = require('../models/game');
const Genre = require('../models/genre');
const GameInstance = require('../models/gameinstance');

const asyncHandler = require('express-async-handler');
//const { body, validationResult } = require('express-validator');
exports.index = asyncHandler(async (req, res, next) => {
  const [numGames, numGameInstances, numGenres] = await Promise.all([
    Game.countDocuments({}).exec(),
    GameInstance.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Video Game Store Inventory',
    game_count: numGames,
    genre_count: numGenres,
    gameinstance_count: numGameInstances,
  });
});

exports.game_list = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const allGames = await Game.find({}, 'title description').sort({ title: 1 }).exec();

  res.render('game_list', {
    title: 'Game List',
    game_list: allGames,
  });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const [game, gameInstances] = await Promise.all([
    Game.findById(req.params.id).populate('genre').exec(),
    GameInstance.find({ game: req.params.id }).populate('game').exec(),
  ]);

  res.render('game_detail', {
    title: 'Game Detail',
    game: game,
    game_instances: gameInstances,
  });
});
